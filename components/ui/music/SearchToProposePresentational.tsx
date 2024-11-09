/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'
import VoteSongButton from './VoteSongButton'
import Image from 'next/image';

const truncate = (str: string, maxLength: number) =>
  str.length > maxLength ? str.slice(0, maxLength) + '...' : str;

interface SearchToProposePresentationalProps {
  searchTerm: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSearchSubmit: (e: React.FormEvent) => void
  searchResults: any[] | undefined
  isLoading: boolean
  error: string | null
  params: { org: string }
}

function SearchToProposePresentational({
  searchTerm,
  handleSearchChange,
  handleSearchSubmit,
  searchResults,
  isLoading,
  error,
  params
}: SearchToProposePresentationalProps) {
  return (
    <div className="w-full max-w-md mx-auto px-8">
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative ">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pr-10 rounded-full bg-white text-custom-black placeholder-custom-lightGreen focus:outline-none focus:ring-2 focus:ring-custom-darkGreen"
            style={{ fontSize: '16px' }}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
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
                <div className="pr-2">
                  <VoteSongButton trackId={track.id} params={params} />
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
