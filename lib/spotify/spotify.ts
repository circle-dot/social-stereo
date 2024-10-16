/* eslint-disable @typescript-eslint/no-explicit-any */
//we need to move this to the backend, so dont worry for now
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

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

export async function getTopTracks() {
  const token = await getAccessToken();
  // Note: This endpoint requires user authorization, which is not possible with Client Credentials flow
  // You might want to use a different endpoint that doesn't require user-specific data
  const response = await fetchWebApi(
    'v1/playlists/37i9dQZEVXbMDoHDwVN2tF', // This is the Global Top 50 playlist
    token
  );
  return response.tracks.items.slice(0, 10).map((item: any) => item.track);
}

// Remove or comment out the following lines as they're not needed in the module
// const topTracks = await getTopTracks();
// console.log(
//   topTracks?.map(
//     ({name, artists}) =>
//       `${name} by ${artists.map(artist => artist.name).join(', ')}`
//   )
// );
export async function searchTracks(query: string) {
    const token = await getAccessToken();
    const response = await fetchWebApi(
      `v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      token
    );
    return response.tracks.items;
  }
  
