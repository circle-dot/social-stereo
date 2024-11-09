/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { EAS_CONFIG } from "@/config/site";
import communities from '@/data/communities.json';

export interface StampInfo {
    id: string;
    title: string;
    description: string;
    imageurl: string;
}

const stampsHistory: StampInfo[] = [
    {
        id: '1',
        title: 'Love at First Sight',
        description: 'You proposed a song.',
        imageurl: 'https://stereo.stamp.network/stamps/loveatfirstsight.png'
    },
    {
        id: '2',
        title: 'Getting there',
        description: 'You vouched for 5 songs',
        imageurl: 'https://stereo.stamp.network/stamps.png'
    },
    {
        id: '3',
        title: 'Livin on a prayer',
        description: 'You vouched for 10 songs.',
        imageurl: 'https://stereo.stamp.network/stamps/livinonaprayer.png'
    },
    {
        id: '4',
        title: 'All In',
        description: 'You used ALL your vouches.',
        imageurl: 'https://stereo.stamp.network/stamps/allin.png'
    },
    {
        id: '5',
        title: 'Midnight DJ',
        description: 'You proposed or voted on songs during the "dead hours" and kept the playlist alive.',
        imageurl: 'https://stereo.stamp.network/stamps/midnightdj.png'
    },
    {
        id: '6',
        title: 'Music Prophet',
        description: 'You voted for three songs that ended up in the top 10. You\'ve got the magic touch!',
        imageurl: 'https://stereo.stamp.network/stamps/musicprophet.png'
    },
    {
        id: '7',
        title: 'Passionate Proposer',
        description: 'You\'ve proposed 10+ songs that have entered the top 100. You bring the hits!',
        imageurl: 'https://stereo.stamp.network/stamps/passionateproposer.png'
    },
    {
        id: '8',
        title: 'Lone Listener',
        description: 'You voted for a song that no one else dared to. We see you.',
        imageurl: 'https://stereo.stamp.network/stamps/lonelistener.png'
    },
    {
        id: '9',
        title: 'Party Catalyst',
        description: 'Your song was the first to reach 10 votes.',
        imageurl: 'https://stereo.stamp.network/stamps/partycatalyst.png'
    },
    {
        id: '10',
        title: 'Genre Guru',
        description: 'You\'ve voted for 10+ songs of the same genre. You\'re kind of an expert, aren\'t you?',
        imageurl: 'https://stereo.stamp.network/stamps/genregu.png'
    },
    {
        id: '11',
        title: 'Diamond Curator',
        description: 'A song you voted ended up in the top 10.',
        imageurl: 'https://stereo.stamp.network/stamps/diamondcurator.png'
    },
    {
        id: '12',
        title: 'Gold Curator',
        description: 'A song you voted ended up in the top 50.',
        imageurl: 'https://stereo.stamp.network/stamps/goldcurator.png'
    },
    {
        id: '13',
        title: 'Silver Curator',
        description: 'A song you voted ended up in the top 100.',
        imageurl: 'https://stereo.stamp.network/stamps/silvercurator.png'
    },
    {
        id: '14',
        title: 'DevCon Sea Atendee',
        description: 'You attended the DevCon SEA event.',
        imageurl: 'https://stereo.stamp.network/stamps/attendee.png'
    },
];

async function checkDevconAttendance(wallet: string): Promise<string | null> {
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
                equals: wallet
            },
            decodedDataJson: {
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
    return data.data.attestations.length > 0 ? data.data.attestations[0].id : null;
}

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

        // Check DevCon attendance and get attestation ID
        const devconAttestationId = await checkDevconAttendance(wallet);

        const result = {
            Stamp1: attestations.length > 0 ? attestations[0].id : null,
            Stamp2: attestations.length >= 5 ? attestations[4].id : null,
            Stamp3: attestations.length >= 10 ? attestations[9].id : null,
            Stamp4: attestations.length === 25 ? attestations[24].id : null,
            Stamp5: earlyMorningAttestation?.id || null,
            Stamp14: devconAttestationId
        };

        console.log('earned stamps', result);

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



export async function PUT(request: Request) {
    try {
        const { wallet, stampId, attestationUID, org } = await request.json();

        if (!wallet || !stampId || !attestationUID || !org) {
            return NextResponse.json(
                { error: 'Wallet address, stampId, attestationUID, and org are required' },
                { status: 400 }
            );
        }

        // Verify conditions for the specific stamp
        const query = `
            query Attestations($where: AttestationWhereInput) {
                attestations(where: $where) {
                    id
                    timeCreated
                }
            }
        `;

        // Find community config
        const communityKey = Object.keys(communities).find(
            key => key.toLowerCase() === org.toLowerCase()
        );

        if (!communityKey) {
            throw new Error(`Community ${org} not found in configuration`);
        }
        const communityConfig = communities[communityKey as keyof typeof communities];

        // Query attestations to verify conditions
        const variables = {
            where: {
                schemaId: { equals: EAS_CONFIG.VOUCH_SCHEMA },
                revoked: { equals: false },
                attester: { equals: wallet },
                AND: [
                    { decodedDataJson: { contains: communityConfig.FirstFilter } },
                    { decodedDataJson: { contains: communityConfig.SecondFilter } },
                    { decodedDataJson: { contains: communityConfig.ThirdFilter } }
                ]
            }
        };

        const response = await fetch(EAS_CONFIG.GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        const data = await response.json();
        const attestations = data.data.attestations;

        // Verify conditions based on stampId
        let isEligible = false;
        let verifiedAttestationId: string | null = null;

        switch (stampId) {
            case "1":
                isEligible = attestations.length > 0;
                verifiedAttestationId = isEligible ? attestations[0].id : null;
                break;
            case "2":
                isEligible = attestations.length >= 5;
                verifiedAttestationId = isEligible ? attestations[4].id : null;
                break;
            case "3":
                isEligible = attestations.length >= 10;
                verifiedAttestationId = isEligible ? attestations[9].id : null;
                break;
            case "4":
                isEligible = attestations.length === 25;
                verifiedAttestationId = isEligible ? attestations[24].id : null;
                break;
            case "5":
                const earlyMorningAtt = attestations.find((att: any) => {
                    const bangkokTime = new Date(att.timeCreated * 1000);
                    bangkokTime.setHours(bangkokTime.getHours() + 7);
                    const hour = bangkokTime.getHours();
                    return hour >= 3 && hour < 6;
                });
                isEligible = !!earlyMorningAtt;
                verifiedAttestationId = earlyMorningAtt?.id || null;
                break;
            case "14":
                // First check if they have the DevCon attestation
                verifiedAttestationId = await checkDevconAttendance(wallet);
                isEligible = verifiedAttestationId !== null;

                // Then check if they already have the stamp
                if (isEligible) {
                    const stampExists = await fetch(EAS_CONFIG.GRAPHQL_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query,
                            variables: {
                                where: {
                                    schemaId: { equals: EAS_CONFIG.STAMP_SCHEMA },
                                    revoked: { equals: false },
                                    recipient: { equals: wallet },
                                    decodedDataJson: {
                                        contains: "DevCon Sea Atendee"
                                    }
                                }
                            }
                        })
                    }).then(res => res.json());

                    console.log('Stamp exists query response:', {
                        wallet,
                        stampId,
                        response: stampExists
                    });

                    if (stampExists.data.attestations.length > 0) {
                        isEligible = false; // They already have the stamp
                    }
                }
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid stampId' },
                    { status: 400 }
                );
        }

        if (!isEligible) {
            return NextResponse.json(
                { error: 'Wallet does not meet conditions for this stamp' },
                { status: 403 }
            );
        }

        // Verify that the attestationUID matches the verified attestation
        if (stampId === "14" && attestationUID !== verifiedAttestationId) {
            return NextResponse.json(
                { error: 'Invalid attestation UID for this stamp' },
                { status: 400 }
            );
        }

        // If eligible, proceed with stamp creation
        const stampApiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STAMP_API_URL}/attestation/stamp`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.STAMP_API_KEY || ""
                },
                body: JSON.stringify({
                    wallet,
                    stamps: {
                        [stampId]: attestationUID
                    }
                })
            }
        );

        const stampApiResponseBody = await stampApiResponse.json();

        return NextResponse.json({
            newAttestations: stampApiResponseBody.results.successful,
            failedAttestations: stampApiResponseBody.results.failed
        });

    } catch (error) {
        console.error('Error creating stamp:', error);
        return NextResponse.json(
            { error: 'Failed to create stamp' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        // Get wallet and org from URL parameters
        const { searchParams } = new URL(request.url);
        const wallet = searchParams.get('wallet');
        const org = searchParams.get('org');

        if (!wallet || !org) {
            return NextResponse.json(
                { error: 'Wallet address and org are required' },
                { status: 400 }
            );
        }

        // Reuse the same GraphQL query from POST
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

        // First query to get earned stamps
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
            }
        };

        const response = await fetch(EAS_CONFIG.GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        const data = await response.json();
        const attestations = data.data.attestations;

        // Calculate earned stamps
        const earlyMorningAttestation = attestations.find((att: { timeCreated: number; }) => {
            const bangkokTime = new Date(att.timeCreated * 1000);
            bangkokTime.setHours(bangkokTime.getHours() + 7);
            const hour = bangkokTime.getHours();
            return hour >= 3 && hour < 6;
        });

        // Check DevCon attendance and get attestation ID
        const devconAttestationId = await checkDevconAttendance(wallet!);

        // Query for existing stamp attestations
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
                }
            }
        };

        const stampResponse = await fetch(EAS_CONFIG.GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: stampVariables })
        });
        const stampData = await stampResponse.json();
        const stampAttestations = stampData.data.attestations;

        // Transform currentStamps into an object with stamp IDs and UIDs
        const currentStamps = stampAttestations.reduce((acc: Record<string, string>, att: { id: string, decodedDataJson: string }) => {
            // Find which stamp this attestation belongs to by checking the decodedDataJson
            const stampNumber = stampsHistory.findIndex(stamp => 
                att.decodedDataJson.includes(stamp.title)
            ) + 1;
            
            if (stampNumber > 0) {
                acc[`Stamp${stampNumber}`] = att.id;
            }
            return acc;
        }, {});

        // Find the stamp 14 attestation if it exists
        const stamp14Attestation = stampAttestations.find((att: any) => 
            att.decodedDataJson.includes("DevCon Sea Atendee")
        );

        const earnedStamps = {
            Stamp1: attestations.length > 0 ? attestations[0].id : null,
            Stamp2: attestations.length >= 5 ? attestations[4].id : null,
            Stamp3: attestations.length >= 10 ? attestations[9].id : null,
            Stamp4: attestations.length === 25 ? attestations[24].id : null,
            Stamp5: earlyMorningAttestation?.id || null,
            // Use the actual stamp attestation ID if it exists, otherwise use null
            Stamp14: stamp14Attestation ? stamp14Attestation.id : null
        };

        // Calculate missing stamps - if we have the condition but not the stamp
        const missingStamps = Object.entries(earnedStamps)
            .filter(([stampKey, stampId]) => {
                if (stampId !== null) return false;
                
                // Special handling for stamp 14
                if (stampKey === 'Stamp14') {
                    return devconAttestationId !== null && !stamp14Attestation;
                }
                
                return false;
            })
            .reduce((acc, [key, _]) => ({
                ...acc,
                [key.replace('Stamp', '')]: key === 'Stamp14' ? devconAttestationId : null
            }), {});

        return NextResponse.json({
            currentStamps,  // Now it will be { Stamp1: "0x123...", Stamp2: "0x456..." }
            missingStamps,
            earnedStamps
        });

    } catch (error) {
        console.error('Error fetching stamps:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stamps' },
            { status: 500 }
        );
    }
}