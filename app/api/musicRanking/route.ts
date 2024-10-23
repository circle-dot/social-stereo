import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

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