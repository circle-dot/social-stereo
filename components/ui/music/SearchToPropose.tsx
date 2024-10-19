"use client"
import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchTracks } from '@/lib/spotify/spotify'
import { debounce } from 'lodash'
import MusicGrid from './MusicGrid'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react';

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
      {searchResults && searchResults.length > 0 && (
        <MusicGrid tracks={searchResults} />
      )}
    </div>
  )
}

export default SearchToPropose
