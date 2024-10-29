import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import privy from '@/lib/privy';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        // Verify Privy token
        const authorization = request.headers.get('authorization');
        if (!authorization) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const verifiedClaims = await privy.verifyAuthToken(authorization);
        if (verifiedClaims.userId !== params.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user has Zupass verification
        const zupass = await prisma.zupass.findFirst({
            where: {
                userId: params.userId
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