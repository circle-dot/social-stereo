import { NextResponse } from 'next/server';
import { whitelistedTickets, TicketTypeName, matchTicketToType } from '@/components/zupass/megazu/mega-config';
import { isEqualEdDSAPublicKey } from '@pcd/eddsa-pcd';
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
            console.log('📦 Received request body:', body);
            
            const { pcdStr } = body;
            if (!pcdStr) {
                console.log('❌ No PCD string provided in request');
                return NextResponse.json(
                    { error: 'No PCD string provided' },
                    { status: 400 }
                );
            }

            // Parse the PCD
            console.log("🔄 Attempting to process PCD...");
            const pcd = typeof pcdStr === 'string' 
                ? JSON.parse(JSON.parse(pcdStr).pcd) // Parse twice to handle nested JSON
                : pcdStr;
            console.log("📄 Parsed PCD:", JSON.stringify(pcd));

            // Validate PCD structure
            if (!pcd || !pcd.claim || !pcd.claim.partialTicket) {
                throw new Error("Invalid PCD structure: missing claim or partialTicket");
            }

            const { productId, eventId } = pcd.claim.partialTicket;
            console.log(`🎫 Ticket details - EventID: ${eventId}, ProductID: ${productId}`);

            if (!eventId || !productId) {
                throw new Error("EventId or ProductId is undefined");
            }

            // Match ticket type
            console.log(`🔍 Matching ticket type...`);
            const ticketType = matchTicketToType(eventId, productId);
            if (!ticketType) {
                console.log('❌ Failed to match ticket type');
                throw new Error("Unable to determine ticket type.");
            }
            console.log(`✅ Matched ticket type: ${ticketType}`);

            // Find matching ticket in whitelist
            const matchedTicket = whitelistedTickets[ticketType].find(
                ticket => ticket.eventId === eventId && ticket.productId === productId
            );

            if (!matchedTicket) {
                console.log('❌ Failed to find matching ticket');
                throw new Error("Unable to find matching ticket.");
            }

            // Verify signature
            console.log('🔐 Verifying Zupass signature...');
            console.log('📝 PCD signer:', JSON.stringify(pcd.claim.signer));

            let isValid = false;
            for (const type of Object.keys(whitelistedTickets) as TicketTypeName[]) {
                const tickets = whitelistedTickets[type];
                if (tickets) {
                    for (const ticket of tickets) {
                        const publicKey = ticket.publicKey;
                        console.log('🔑 Checking against public key:', JSON.stringify(publicKey));

                        if (isEqualEdDSAPublicKey(publicKey, pcd.claim.signer)) {
                            isValid = true;
                            console.log('✅ Found matching public key');
                            break;
                        }
                    }
                }
                if (isValid) break;
            }

            if (!isValid) {
                console.error(`❌ PCD is not signed by Zupass`);
                return NextResponse.json(
                    { error: "PCD is not signed by Zupass" },
                    { status: 401 }
                );
            }

            // Check nullifier
            if (!pcd.claim.nullifierHash) {
                return NextResponse.json(
                    { error: "PCD ticket nullifier has not been defined" },
                    { status: 401 }
                );
            }

            // Return successful response
            const response = {
                user: pcd.claim.partialTicket,
                nullifier: pcd.claim.nullifierHash,
                ticketType,
                eventName: matchedTicket.eventName,
                productName: matchedTicket.productName
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
