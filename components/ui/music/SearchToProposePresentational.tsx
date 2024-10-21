import React from 'react'
import MusicGrid from './MusicGrid'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyTrack {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: { spotify: string };
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    release_date: string;
    release_date_precision: string;
    type: string;
    uri: string;
    artists: SpotifyArtist[];
  };
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

interface SearchResults {
  tracks: {
    href: string;
    items: SpotifyTrack[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

interface SearchToProposePresentationalProps {
  searchTerm: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSearchSubmit: (e: React.FormEvent) => void
  searchResults: SearchResults | undefined
}

function SearchToProposePresentational({
  searchTerm,
  handleSearchChange,
  handleSearchSubmit,
  searchResults,
}: SearchToProposePresentationalProps) {
  return (
    <div className="max-w-2xl mx-auto w-full">
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-custom-purple text-white placeholder-custom-lightGreen focus:outline-none focus:ring-2 focus:ring-custom-darkGreen"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-lightGreen" size={20} />
        </div>
      </form>
      {searchResults && searchResults.tracks && searchResults.tracks.items && searchResults.tracks.items.length > 0 && (
        <MusicGrid tracks={searchResults.tracks.items} />
      )}
    </div>
  )
}

export default SearchToProposePresentational
