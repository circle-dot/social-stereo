import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import communities from '@/data/communities.json';

// Add these utility functions at the top of the file
function ethAddressToSpotifyId(ethAddress: string): string {
    // Since we can't directly use the Rust bigint libraries,
    // we'll implement a simplified version for JavaScript
    const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const address = ethAddress.toLowerCase().replace("0x", "");
    
    // Convert hex to decimal
    const decimal = BigInt("0x" + address);
    
    // Convert decimal to base62
    let result = "";
    let n = decimal;
    while (n > 0n) {
        const remainder = Number(n % 62n);
        result = BASE62[remainder] + result;
        n = n / 62n;
    }
    
    return result || "0";
}


function getTableName(community: string): string | null {
    // Convert community to lowercase for case-insensitive comparison
    const communityLower = community.toLowerCase();
    
    // Find the matching community by comparing lowercase values
    const matchingCommunity = Object.entries(communities).find(([key]) => 
        key.toLowerCase() === communityLower
    );
    
    if (!matchingCommunity) return null;
    
    // Use the original casing from the communities.json for the table name
    return `Music${matchingCommunity[1].id}`;
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const community = searchParams.get('community');
    
    // Validate community parameter
    if (!community) {
        return NextResponse.json({ error: 'Community parameter is required' }, { status: 400 });
    }
    
    const tableName = getTableName(community);
    if (!tableName) {
        return NextResponse.json({ error: 'Invalid community' }, { status: 400 });
    }

    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '12';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';
    const searchQuery = searchParams.get('searchQuery') || '';

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereClause: any = {
            ...(
                searchQuery
                ? {
                    OR: [
                        { title: { contains: searchQuery, mode: 'insensitive' } },
                        { artist: { contains: searchQuery, mode: 'insensitive' } },
                        { album: { contains: searchQuery, mode: 'insensitive' } },
                    ],
                }
                : {}
            ),
            rank: { not: null }
        };

        // @ts-expect-error - Prisma doesn't type dynamic table names well
        const music = await prisma[tableName].findMany({
            skip,
            take: pageSize,
            orderBy: {
                rank: sortOrder,
            },
            where: whereClause,
        });

        // @ts-expect-error - Prisma doesn't type dynamic table names well
        const totalMusic = await prisma[tableName].count({
            where: whereClause,
        });

        const hasMore = skip + pageSize < totalMusic;
        const nextPage = hasMore ? pageNumber + 1 : undefined;

        return NextResponse.json({
            music,
            total: totalMusic,
            hasMore,
            nextPage,
        });
    } catch (error) {
        console.error('Error fetching music:', error);
        return NextResponse.json({ error: 'Failed to fetch music' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { recipients, community } = await req.json();
        
        if (!community) {
            return NextResponse.json(
                { error: 'Community parameter is required' },
                { status: 400 }
            );
        }

        const tableName = getTableName(community);
        if (!tableName) {
            return NextResponse.json({ error: 'Invalid community' }, { status: 400 });
        }

        if (!Array.isArray(recipients)) {
            return NextResponse.json(
                { error: 'Recipients must be an array' },
                { status: 400 }
            );
        }

        // Convert ETH addresses to Spotify IDs
        const spotifyIds = recipients.map(ethAddressToSpotifyId);

        // Use dynamic table name with prisma
        // @ts-expect-error - Prisma doesn't type dynamic table names well
        const musicEntries = await prisma[tableName].findMany({
            where: {
                spotify_id: {
                    in: spotifyIds
                }
            }
        });

        return NextResponse.json({ 
            music: musicEntries 
        }, { status: 200 });
    } catch (error) {
        console.error('Error processing music request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
