/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import VoteSongButton from './VoteSongButton'
import Image from 'next/image';
import SpotifyLogo from '@/public/Spotify_Full_Logo_RGB_Green.png'
import Link from 'next/link'

const truncate = (str: string, maxLength: number) => 
  str.length > maxLength ? str.slice(0, maxLength) + '...' : str;

interface SearchToProposePresentationalProps {
  searchTerm: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSearchSubmit: (e: React.FormEvent) => void
  searchResults: any[] | undefined
  isLoading: boolean
  error: string | null
}

function SearchToProposePresentational({
  searchTerm,
  handleSearchChange,
  handleSearchSubmit,
  searchResults,
  isLoading,
  error
}: SearchToProposePresentationalProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex">
          <Input
            type="text"
            placeholder="Search for a song..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading} className="ml-2">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {searchResults && searchResults.length > 0 ? (
        <>
          {searchResults.map((track: any) => (
            <div key={track.id} className="flex items-stretch mb-2 h-16">
              <div className="flex items-center flex-grow bg-white rounded-lg overflow-hidden">
                <div className="h-full w-16 relative">
                  <Image
                    src={track.imageUrl}
                    alt={`${track.title} album cover`}
                    width={100}
                    height={100}
                    className="rounded-lg border border-custom-lightGreen object-cover"
                  />
                </div>
                <div className="flex-grow px-3 py-2">
                  <h3 className="font-bold text-custom-dark truncate">
                    {truncate(track.title, 10)}
                  </h3>
                  <p className="text-sm text-custom-dark truncate">
                    {truncate(track.artist, 10)}
                  </p>
                </div>
                <div className="flex items-center pr-2">
                  <Link href={track.spotifyUrl} target="_blank" rel="noopener noreferrer" className="mr-2 text-[#121212] font-sans">Open in 
                    <Image width={70} height={70} src={SpotifyLogo} alt='Spotify logo' />
                  </Link>
                  <VoteSongButton trackId={track.id} />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        !isLoading && !error && searchTerm && <p className="text-center">No results found</p>
      )}
    </div>
  )
}

export default SearchToProposePresentational
