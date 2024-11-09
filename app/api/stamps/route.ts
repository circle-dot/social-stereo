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

        console.log('earned stamps', result);

        const stampsHistory = [
            {
              id: '1',
              title: 'Love at First Sight',
              description: 'You proposed a song.',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '2',
              title: 'Getting there',
              description: 'You vouched for 5 songs',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '3',
              title: 'Livin on a prayer',
              description: 'You vouched for 10 songs.',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '4',
              title: 'All In',
              description: 'You used ALL your vouches.',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '5',
              title: 'Midnight DJ',
              description: 'You proposed or voted on songs during the "dead hours" and kept the playlist alive.',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '6',
              title: 'Music Prophet',
              description: 'You voted for three songs that ended up in the top 10. You\'ve got the magic touch!',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '7',
              title: 'Passionate Proposer',
              description: 'You\'ve proposed 10+ songs that have entered the top 100. You bring the hits!',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '8',
              title: 'Lone Listener',
              description: 'You voted for a song that no one else dared to. We see you.',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '9',
              title: 'Party Catalyst',
              description: 'Your song was the first to reach 10 votes.',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '10',
              title: 'Genre Guru',
              description: 'You\'ve voted for 10+ songs of the same genre. You\'re kind of an expert, aren\'t you?',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '11',
              title: 'Diamond Curator',
              description: 'A song you voted ended up in the top 10.',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '12',
              title: 'Gold Curator',
              description: 'A song you voted ended up in the top 50.',
              icon: '/StampIt.png',
              isLocked: true
            },
            {
              id: '13',
              title: 'Silver Curator',
              description: 'A song you voted ended up in the top 100.',
              icon: '/StampIt.png',
              isLocked: true
            }
          ];
        // Create AND conditions for non-null stamps
        const stampConditions = Object.entries(result)
            .filter(([_, value]) => value !== null)
            .map(([key, _]) => {
                // Get stamp number (e.g., "1" from "Stamp1")
                const stampNumber = key.replace('Stamp', '');
                // Find corresponding stamp title from stampsHistory
                const stamp = stampsHistory.find(s => s.id === stampNumber);
                return {
                    decodedDataJson: {
                        contains: stamp?.title || ''
                    }
                };
            });

        console.log('stamp conditions', stampConditions);
        // Second GraphQL query with stamp conditions
        const stampVariables = {
            where: {
                schemaId: {
                    equals: EAS_CONFIG.STAMP_SCHEMA
                },
                revoked: {
                    equals: false
                },
                recipient: {
                    equals: wallet
                },
                OR: stampConditions
            },
            orderBy: [
                {
                    timeCreated: "desc"
                }
            ]
        };

        // Make second GraphQL request
        const stampResponse = await fetch(EAS_CONFIG.GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: stampVariables
            })
        });
        const stampData = await stampResponse.json();
        
        // Process the second set of attestations
        const stampAttestations = stampData.data.attestations;
        
        console.log("Received stamps", stampAttestations);

        // Find missing stamps (earned but not attested)
        const missingStamps = Object.entries(result)
            .filter(([stampKey, stampId]) => {
                // Skip null stamps (not earned)
                if (stampId === null) return false;
                
                // Check if this stamp ID is found in any of the stampAttestations
                return !stampAttestations.some((att: any) => 
                    att.decodedDataJson.includes(stampId)
                );
            })
            .reduce((acc, [key, value]) => ({
                ...acc,
                [key.replace('Stamp', '')]: value
            }), {});

        console.log("missing stamps", missingStamps);
        console.log('earned stamps', result);

        // Only call stamp API if there are missing stamps
        if (Object.keys(missingStamps).length > 0) {
            const stampApiResponse = await fetch(
                `${process.env.NEXT_PUBLIC_STAMP_API_URL}/attestation/stamp`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.STAMP_API_KEY || ""
                    },
                    body: JSON.stringify({
                        wallet: wallet,
                        stamps: missingStamps
                    })
                }
            );
            const stampApiResponseBody = await stampApiResponse.json();
            console.log('stamp api response', stampApiResponseBody);

            // Create a map of new attestations
            const newAttestations = stampApiResponseBody.results.successful.reduce((acc: any, stamp: any) => ({
                ...acc,
                [`Stamp${stamp.stampId}`]: stamp.attestationUID
            }), {});

            // Merge original earned stamps with new attestations
            const updatedStamps = {
                ...result,
                ...newAttestations
            };

            return NextResponse.json({
                earnedStamps: updatedStamps,
                newAttestations: stampApiResponseBody.results.successful,
                failedAttestations: stampApiResponseBody.results.failed
            });
        }

        return NextResponse.json({
            earnedStamps: result,
            missingAttestations: missingStamps
        });

    } catch (error) {
        console.error('Error fetching stamps:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stamps' },
            { status: 500 }
        );
    }
}