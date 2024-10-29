"use client"
import React, { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchTracks } from '@/lib/spotify/spotify'
import { debounce } from 'lodash'
import SearchToProposePresentational from './SearchToProposePresentational'

function SearchToPropose() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const { data: searchResults, error, isLoading, refetch } = useQuery({
    queryKey: ['searchTracks', debouncedSearchTerm],
    queryFn: () => searchTracks(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0,
    staleTime: Infinity,
    retry: 1, 
  })

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value)
    }, 800),
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

  // Log error if it occurs
  useEffect(() => {
    if (error) {
      console.error('Error searching tracks:', error)
    }
  }, [error])

  return (
    <SearchToProposePresentational
      searchTerm={searchTerm}
      handleSearchChange={handleSearchChange}
      handleSearchSubmit={handleSearchSubmit}
      searchResults={searchResults?.music}
      isLoading={isLoading}
      error={error instanceof Error ? error.message : error ? 'An error occurred' : null}
    />
  )
}

export default SearchToPropose
