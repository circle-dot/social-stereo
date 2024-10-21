"use client"
import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchTracks } from '@/lib/spotify/spotify'
import { debounce } from 'lodash'
import SearchToProposePresentational from './SearchToProposePresentational'

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
    <SearchToProposePresentational
      searchTerm={searchTerm}
      handleSearchChange={handleSearchChange}
      handleSearchSubmit={handleSearchSubmit}
      searchResults={searchResults}
    />
  )
}

export default SearchToPropose