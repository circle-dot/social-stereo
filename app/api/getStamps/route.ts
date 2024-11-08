import { NextResponse } from 'next/server';
import privy from '@/lib/privy';

const stamps = [
    { id: '1', title: 'Music Prophet', description: 'You voted for three songs that ended up in the top 10. You\'ve got the magic touch!', icon: '/StampIt.png', isLocked: true },
    { id: '2', title: 'Passionate Proposer', description: 'You\'ve proposed 10+ songs that have entered the top 100. You bring the hits!', icon: '/StampIt.png', isLocked: true },
    { id: '3', title: 'Midnight DJ', description: 'You proposed or voted on songs during the "dead hours" and kept the playlist alive.', icon: '/StampIt.png', isLocked: true },
    { id: '4', title: 'Lone Listener', description: 'You voted for a song that no one else dared to. We see you.', icon: '/StampIt.png', isLocked: true },
    { id: '5', title: 'Party Catalyst', description: 'Your song was the first to reach 10 votes.', icon: '/StampIt.png', isLocked: true },
    { id: '6', title: 'Genre Guru', description: 'You\'ve voted for 10+ songs of the same genre. You\'re kind of an expert, aren\'t you?', icon: '/StampIt.png', isLocked: true },
    { id: '7', title: 'Love at First Sight', description: 'You proposed a song.', icon: '/StampIt.png', isLocked: true },
    { id: '8', title: 'Diamond Curator', description: 'A song you voted ended up in the top 10.', icon: '/StampIt.png', isLocked: true },
    { id: '9', title: 'Gold Curator', description: 'A song you voted ended up in the top 50.', icon: '/StampIt.png', isLocked: true },
    { id: '10', title: 'Silver Curator', description: 'A song you voted ended up in the top 100.', icon: '/StampIt.png', isLocked: true },
    { id: '11', title: 'Diverse Taste', description: 'You liked several genres while proposing.', icon: '/StampIt.png', isLocked: true },
    { id: '12', title: 'All In', description: 'You used ALL your vouches.', icon: '/StampIt.png', isLocked: true },
];

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
        console.log('verifiedClaims', verifiedClaims)
        // Get user's stamps from Zupass table
        // const stamps = await prisma.stamps.findMany({
        //     where: {
        //         wallet: verifiedClaims?.wallet
        //     }
        // });

        // Transform stamps into the format expected by the frontend
        const formattedStamps = stamps.map((stamp, index) => ({
            id: index.toString(),
            title: stamp.title,
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
