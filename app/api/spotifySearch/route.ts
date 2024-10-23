/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Missing Spotify client ID or secret');
}

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  return data.access_token;
}

async function fetchWebApi(endpoint: string, token: string) {
  const response = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const token = await getAccessToken();
    const response = await fetchWebApi(
      `v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      token
    );

    const formattedTracks = response.tracks.items.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      imageUrl: track.album.images[0].url,
      spotifyUrl: track.external_urls.spotify,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      music: formattedTracks,
    });
  } catch (error) {
    console.error('Error searching tracks:', error);
    return NextResponse.json({ error: 'Failed to search tracks' }, { status: 500 });
  }
}
