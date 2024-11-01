import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import privy from '@/lib/privy'

export async function POST(request: NextRequest) {
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

        const wallet = await prisma.user.findUnique({
            where: {
                id: verifiedClaims.userId,
            },
            select: {
                wallet: true,
            },
        });


        if (!wallet) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Get the request body
        const body = await request.json()

        // Append wallet to body
        const enrichedBody = {
            ...body,
            wallet: wallet.wallet
        }

        // Forward the request to the STAMP API
        const response = await fetch(`${process.env.NEXT_PUBLIC_STAMP_API_URL}/pod/verify-proof`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
                'x-privy-app-id': 'stamp'
            },
            body: JSON.stringify(enrichedBody)
        })

        // Get the response data
        const data = await response.json()
        
        // If the verification was successful, save the attestation
        if (response.ok) {  
            const attestationUID = data.attestationUID;
            await prisma.zupass.create({
                data: {
                    attestationUID: attestationUID,
                    userId: verifiedClaims.userId,
                    nullifier: data.nullifier,
                    createdAt: new Date(),
                }
            });
        }

        return NextResponse.json(data, { status: response.status })

    } catch (error) {
        console.error('Error verifying POD:', error)
        return NextResponse.json({ error: 'Failed to verify POD' }, { status: 500 })
    }
}