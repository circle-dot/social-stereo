import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import privy from '@/lib/privy';

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
            const { pcds, user } = body;
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
                throw new Error(error.message || "External validation failed");
            }

            const validationResults = await validationResponse.json();
            const validationResult = validationResults[0]; // Since we only send one PCD

            // Write to Zupass table with additional data from validation
            console.log("📝 Writing to Zupass table...");
            let zupassEntry;
            try {
                zupassEntry = await prisma.zupass.create({
                    data: {
                        userId: verifiedClaims.userId,
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
        console.error('Full error details:', {
            name: error instanceof Error ? error.name : undefined,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: 'Authentication failed', details: error instanceof Error ? error.message : String(error) },
            { status: 401 }
        );
    }
}
