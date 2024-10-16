"use client"
import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchTracks } from '@/lib/spotify/spotify'
import { debounce } from 'lodash'
import MusicGrid from './MusicGrid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function SearchToPropose() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const { data: searchResults, refetch, isLoading } = useQuery({
    queryKey: ['searchTracks', debouncedSearchTerm],
    queryFn: () => searchTracks(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0,
    staleTime: Infinity,
  })

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value)
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for a track..."
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
      {searchResults && searchResults.length > 0 && (
        <MusicGrid tracks={searchResults} />
      )}
    </div>
  )
}

export default SearchToPropose
