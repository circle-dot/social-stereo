import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import privy from '@/lib/privy';
import { ethers } from 'ethers';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        console.log('GET request for wallet:', params.slug);
        
        // Verify Privy token
        const authorization = request.headers.get('authorization');
        if (!authorization) {
            console.log('No authorization token found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Verifying Privy token...');
        const verifiedClaims = await privy.verifyAuthToken(authorization);
        console.log('Privy claims:', verifiedClaims);

        // Check if the user exists and create if not
        let user = await prisma.user.findFirst({
            where: {
                id: verifiedClaims.userId,
            }
        });
        console.log('Found user:', user);

        if (!user) {
            console.log('Creating new user...');
            user = await prisma.user.create({
                data: {
                    id: verifiedClaims.userId,
                    wallet: ethers.getAddress(params.slug)
                }
            });
            console.log('Created user:', user);
        }

        // Verify the wallet matches
        console.log('Comparing wallets:', {
            userWallet: user.wallet.toLowerCase(),
            paramWallet: params.slug.toLowerCase()
        });
        
        if (user.wallet.toLowerCase() !== params.slug.toLowerCase()) {
            console.log('Wallet mismatch');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user has Zupass verification
        const normalizedWallet = ethers.getAddress(params.slug)
        console.log('Checking Zupass for wallet:', normalizedWallet);
        
        const zupass = await prisma.zupass.findFirst({
            where: {
                wallet: normalizedWallet
            }
        });
        console.log('Zupass verification result:', zupass);

        if (!zupass) {
            console.log('No Zupass verification found');
            return NextResponse.json({ error: 'Zupass verification required' }, { status: 404 });
        }

        return NextResponse.json({ verified: true });

    } catch (error) {
        console.error('Error in GET /api/user/[slug]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}