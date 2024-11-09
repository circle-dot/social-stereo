import { NextResponse } from 'next/server';
import { EAS_CONFIG } from "@/config/site";
import communities from '@/data/communities.json';

export async function POST(request: Request) {
    try {
        const { wallet, org } = await request.json();

        if (!wallet || !org) {
            return NextResponse.json(
                { error: 'Wallet address and org are required' },
                { status: 400 }
            );
        }

        // Construct GraphQL query
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
                // Find community config case-insensitively
                const communityKey = Object.keys(communities).find(
                    key => key.toLowerCase() === org.toLowerCase()
                );
        
                if (!communityKey) {
                    throw new Error(`Community ${org} not found in configuration`);
                }
        const communityConfig = communities[communityKey as keyof typeof communities];

        const variables = {
            where: {
                schemaId: {
                    equals: EAS_CONFIG.VOUCH_SCHEMA
                },
                revoked: {
                    equals: false
                },
                attester: {
                    equals: wallet
                },
                AND: [
                    {
                        decodedDataJson: {
                            contains: communityConfig.FirstFilter
                        }
                    },
                    {
                        decodedDataJson: {
                            contains: communityConfig.SecondFilter
                        }
                    },
                    {
                        decodedDataJson: {
                            contains: communityConfig.ThirdFilter
                        }
                    }
                ]
            },
            orderBy: [
                {
                    timeCreated: "desc"
                }
            ]
        };

        // Make GraphQL request
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
        
        // Process the attestations
        const attestations = data.data.attestations;
        
        // Find the first early morning attestation
        const earlyMorningAttestation = attestations.find((att: { timeCreated: number; }) => {
            const bangkokTime = new Date(att.timeCreated * 1000);
            bangkokTime.setHours(bangkokTime.getHours() + 7); // Convert to UTC+7 (Bangkok)
            const hour = bangkokTime.getHours();
            return hour >= 3 && hour < 6;
        });

        const result = {
            Stamp1: attestations.length > 0 ? attestations[0].id : null,
            Stamp2: attestations.length >= 5 ? attestations[4].id : null,
            Stamp3: attestations.length >= 10 ? attestations[9].id : null,
            Stamp4: attestations.length === 25 ? attestations[24].id : null,
            Stamp5: earlyMorningAttestation?.id || null
        };
        
        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching stamps:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stamps' },
            { status: 500 }
        );
    }
}