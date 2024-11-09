/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import privy from '@/lib/privy';
import { EAS_CONFIG } from "@/config/site";
import { ethers } from 'ethers';

let user: any; // We'll populate this from the request body

function decodeBytes32(bytes32: string): string {
    try {
      // Remove trailing zeros and convert to string
      return ethers.decodeBytes32String(bytes32.replace(/0+$/, ''));
    } catch {
      // If decoding fails, return the original value
      return bytes32;
    }
  }

export async function POST(request: Request) {
        try {
            // Verify Privy token
            const authorization = request.headers.get('authorization');
    
            if (!authorization || typeof authorization !== 'string') {
                console.error('Authorization header is missing or invalid');
                return NextResponse.json({ error: 'Authorization header missing or invalid' }, { status: 401 });
            }
            let verifiedClaims;
            try {
                verifiedClaims = await privy.verifyAuthToken(authorization);
            } catch (error) {
                console.error('Token verification failed:', error);
                return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
            }
    
            console.log('🟢 Starting ZuAuth verification...');
            const body = await request.json();
            const { pcds, user: requestUser } = body;
            user = requestUser; // Assign to our outer scoped variable
            console.log('📦 Received request body:', body);
            
            if (!pcds) {
                console.log('❌ No PCD string provided in request');
                return NextResponse.json(
                    { error: 'No PCD string provided' },
                    { status: 400 }
                );
            }

            // Check if user exists and create if not
            console.log("🔍 Checking if user exists...");
            let dbUser = await prisma.user.findUnique({
                where: {
                    id: verifiedClaims.userId
                }
            });

            if (!dbUser) {
                console.log("👤 Creating new user...");
                dbUser = await prisma.user.create({
                    data: {
                        id: verifiedClaims.userId,
                        wallet: user.wallet.address
                    }
                });
                console.log("✅ New user created");
            }

            // Forward to external validation service
            console.log("🔄 Forwarding to external validation service...");
            console.log('authorization', authorization)
            const validationResponse = await fetch(`${process.env.NEXT_PUBLIC_STAMP_API_URL}/pcds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${authorization}`,
                    'x-privy-app-id': "stamp"
                },
                body: JSON.stringify({
                    pcds: pcds,
                    user: user
                })
            });

            if (!validationResponse.ok) {
                const error = await validationResponse.json();
                console.error("❌ External validation failed:", error);
                throw new Error(JSON.stringify(error) || "External validation failed");
            }

            const validationResults = await validationResponse.json();
            const validationResult = validationResults[0]; // Since we only send one PCD

            // Write to Zupass table with additional data from validation
            console.log("📝 Writing to Zupass table...");
            try {
                await prisma.zupass.create({
                    data: {
                        wallet: user.wallet.address,
                        nullifier: validationResult.nullifier,
                        attestationUID: validationResult.attestationUID,
                        category: validationResult.category,
                        subcategory: validationResult.subcategory,
                        credentialType: validationResult.credentialType,
                        platform: validationResult.platform
                    }
                });
                console.log("✅ Successfully wrote to Zupass table");


            } catch (error) {
                console.error("❌ Error writing to Zupass table:", error);
                throw new Error("Failed to save Zupass verification");
            }

            // Return successful response
            const response = {
                user: {
                    eventId: validationResult.eventId,
                    productId: validationResult.productId
                },
                nullifier: validationResult.nullifier,
                attestationUID: validationResult.attestationUID,
                category: validationResult.category,
                subcategory: validationResult.subcategory,
                platform: validationResult.platform,
                issuer: validationResult.issuer
            };

            console.log("✅ Verification successful:", response);
            return NextResponse.json(response);

    } catch (error) {
        console.error('❌ ZuAuth verification error:', error);
        
        // Parse error message if it's a string containing JSON
        let parsedError;
        try {
            if (error instanceof Error) {
                parsedError = JSON.parse(error.message);
            }
        } catch {
            // If parsing fails, continue with original error
        }

        // Check for the specific "Already registered" error
        if (parsedError?.message?.[0]?.error?.includes('POD is already registered')) {
            // Check GraphQL for existing attestation
            console.log("🔍 Checking GraphQL for existing attestation...");
            const query = `
                query Attestations($where: AttestationWhereInput) {
                    attestations(where: $where) {
                        id
                        attester
                        timeCreated
                        recipient
                        decodedDataJson
                    }
                }
            `;

            const variables = {
                where: {
                    schemaId: {
                        equals: EAS_CONFIG.PRETRUST_SCHEMA
                    },
                    revoked: {
                        equals: false
                    },
                    recipient: {
                        equals: user.wallet.address
                    },
                    decodedDataJson:{
                        contains: '0x446576636f6e0000000000000000000000000000000000000000000000000000'
                    }
                }
            };

            const response = await fetch(EAS_CONFIG.GRAPHQL_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });
            
            const data = await response.json();
            console.log('GraphQL response:', data);

            if (data.data?.attestations?.length > 0) {
                const attestation = data.data.attestations[0];
                console.log('attestation', attestation)
                try {
                    // The decodedDataJson is already a JSON string containing the array
                    const decodedDataArray = JSON.parse(attestation.decodedDataJson);
                    
                    // Helper function to find and decode a specific field
                    const getDecodedField = (fieldName: string) => {
                        const field = decodedDataArray.find((item: any) => item.name === fieldName);
                        if (field?.value?.value) {
                            return decodeBytes32(field.value.value);
                        }
                        return '';
                    };

                    // Create new Zupass entry with decoded values
                    const newZupass = await prisma.zupass.create({
                        data: {
                            wallet: attestation.recipient,
                            nullifier: getDecodedField('nullifier'),
                            attestationUID: attestation.id,
                            category: getDecodedField('category'),
                            subcategory: getDecodedField('subcategory'),
                            credentialType: getDecodedField('credentialType'),
                            platform: getDecodedField('platform'),
                        }
                    });

                    return NextResponse.json({ 
                        decodedDataJson: newZupass 
                    });
                } catch (parseError) {
                    console.error('Error parsing attestation data:', parseError);
                    throw new Error('Invalid attestation data format');
                }
            }

            // If no attestation found, return the original error
            return NextResponse.json(
                { 
                    error: 'Ticket already used',
                    details: 'This ticket has already been registered'
                },
                { status: 409 }
            );
        }

        // Default error response for other cases
        const errorMessage = error instanceof Error 
            ? error.message
            : typeof error === 'object' 
                ? JSON.stringify(error) 
                : String(error);
                
        return NextResponse.json(
            { 
                error: 'Authentication failed', 
                details: errorMessage
            },
            { status: 401 }
        );
    }
}
