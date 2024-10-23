"use client"
import React, { useState, useCallback } from 'react'
import TitleSection from '@/components/ui/TitleSection'
import MusicGrid from '@/components/ui/music/MusicGrid'
import { SITE_CONFIG } from '@/config/site'
import { Button } from '@/components/ui/button'
import useMusic from '@/utils/hooks/useSearchSongs'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { debounce } from 'lodash'
import Link from 'next/link'

function MusicPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const { data, isLoading, fetchNextPage, hasNextPage } = useMusic(sortOrder, debouncedSearchTerm)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      // This will trigger a new query with the updated search term
      setDebouncedSearchTerm(value)
    }, 600),
    []
  )

  const tracks = data?.pages.flatMap(page => page.music) || []

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 pb-32">
      <div className="mb-4">
        <TitleSection>{SITE_CONFIG.description}</TitleSection>
        <p className='text-sm text-white mb-4'>Playlist Last Updated: {new Date().toLocaleDateString()}</p>
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
      </div>
      <div className="flex-grow overflow-y-auto">
        <MusicGrid tracks={tracks} />
      </div>
      {hasNextPage && (
        <Button 
          onClick={() => fetchNextPage()} 
          disabled={isLoading}
          className="bg-custom-lightGreen text-custom-black h-10 py-4 px-6 rounded-full w-full mt-4 mb-10"
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </Button>
      )}
   <Button asChild className="bg-custom-lightGreen text-custom-black h-10 py-4 px-6 rounded-full w-full mt-4 mb-10 text-center">
   <Link href="/feed/music/propose" >
        Propose your song
   </Link>
   </Button>
    </div>
  )
}

export default MusicPage
