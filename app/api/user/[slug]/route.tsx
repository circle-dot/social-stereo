import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import privy from '@/lib/privy';
import { ethers } from 'ethers';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        // Verify Privy token
        const authorization = request.headers.get('authorization');
        if (!authorization) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const verifiedClaims = await privy.verifyAuthToken(authorization);

        // Check if the user exists and create if not
        let user = await prisma.user.findFirst({
            where: {
                id: verifiedClaims.userId,
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: verifiedClaims.userId,
                    wallet: ethers.getAddress(params.slug)
                }
            });
        }

        // Verify the wallet matches
        if (user.wallet.toLowerCase() !== params.slug.toLowerCase()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user has Zupass verification
        const zupass = await prisma.zupass.findFirst({
            where: {
                wallet: ethers.getAddress(params.slug).toLowerCase()
            }
        });

        if (!zupass) {
            return NextResponse.json({ error: 'Zupass verification required' }, { status: 404 });
        }

        return NextResponse.json({ verified: true });

    } catch (error) {
        console.error('Error checking Zupass verification:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}