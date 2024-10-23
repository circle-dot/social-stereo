export async function searchTracks(query: string) {
  const response = await fetch(`/api/spotifySearch?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search tracks');
  }
  return response.json();
}