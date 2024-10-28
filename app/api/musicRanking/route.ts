import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

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

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '12';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';
    const searchQuery = searchParams.get('searchQuery') || '';

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    try {
        const whereClause: Prisma.MusicWhereInput = searchQuery
            ? {
                OR: [
                    { title: { contains: searchQuery, mode: 'insensitive' } },
                    { artist: { contains: searchQuery, mode: 'insensitive' } },
                    { album: { contains: searchQuery, mode: 'insensitive' } },
                ],
            }
            : {};

        const music = await prisma.music.findMany({
            skip,
            take: pageSize,
            orderBy: {
                rank: sortOrder,
            },
            where: whereClause,
        });

        const totalMusic = await prisma.music.count({
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
        const { recipients } = await req.json();
        
        if (!Array.isArray(recipients)) {
            return NextResponse.json(
                { error: 'Recipients must be an array' },
                { status: 400 }
            );
        }

        // Convert ETH addresses to Spotify IDs
        const spotifyIds = recipients.map(ethAddressToSpotifyId);

        // Fetch music entries from database
        const musicEntries = await prisma.music.findMany({
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
