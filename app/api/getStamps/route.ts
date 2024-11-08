import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import privy from '@/lib/privy';

export async function GET(request: Request) {
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

        // Get user's stamps from Zupass table
        const stamps = await prisma.stamps.findMany({
            where: {
                wallet: verifiedClaims.wallet
            }
        });

        // Transform stamps into the format expected by the frontend
        const formattedStamps = stamps.map((stamp, index) => ({
            id: index.toString(),
            title: `${stamp.category} - ${stamp.subcategory}`,
            description: stamp.description,
            icon: '/StampIt.png',
            isLocked: stamp?.isLocked
        }));

        return NextResponse.json(formattedStamps);

    } catch (error) {
        console.error('Error fetching stamps:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch stamps',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
