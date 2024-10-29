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
import { usePrivy } from '@privy-io/react-auth'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogOverlay } from '@/components/ui/dialog'

function MusicPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const { login, authenticated, ready, user } = usePrivy()
  const [sortOrder] = useState<'asc' | 'desc'>('asc')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data, isLoading, fetchNextPage, hasNextPage } = useMusic(sortOrder, debouncedSearchTerm)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleVotesClick = (e: React.MouseEvent) => {
    if (!authenticated && ready) {
      e.preventDefault()
      setIsDialogOpen(true)
    }
  }

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value)
    }, 600),
    []
  )

  const tracks = data?.pages.flatMap(page => page.music) || []

  return (
    <div className="flex flex-col max-w-2xl mx-auto p-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-[100]" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110] bg-custom-purple p-6 rounded-lg shadow-xl w-[90%] max-w-[400px]" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogTitle className="text-xl font-semibold text-custom-lightGreen">Login Required</DialogTitle>
          <DialogDescription className="text-white mt-2">
            You need to be logged in to view your votes.
          </DialogDescription>
          <DialogFooter className="mt-6 flex flex-col space-y-2 !items-end w-full">
            <Button 
              onClick={() => { 
                login({
                  disableSignup: true, 
                })
                setIsDialogOpen(false); 
              }} 
              className="w-full bg-custom-lightGreen text-custom-black hover:bg-custom-lightGreen/90 py-3"
            >
              Log In
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setIsDialogOpen(false)} 
              className="w-full bg-custom-darkGreen text-white hover:bg-custom-darkGreen/90 py-3"
            >
              Cancel
            </Button>
            <div className="w-full text-center text-sm text-white mt-2">
              Dont have an account?{' '}
              <Link href="/feed/login" className="text-custom-lightGreen hover:underline" onClick={() => setIsDialogOpen(false)}>
                Register here
              </Link>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-4">
        <TitleSection>{SITE_CONFIG.description}</TitleSection>
        <p className='text-sm text-white mb-4'>Updates every five minutes</p>
        <div className="relative">
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-custom-black placeholder-custom-lightGreen focus:outline-none focus:ring-2 focus:ring-custom-darkGreen"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-lightGreen" size={20} />
        </div>
      </div>
      <div className="flex-grow">
        {tracks.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-white mb-4">
              Looks like this song isn&apos;t in the Top 100 yet!
            </p>
            <Button asChild className="bg-custom-lightGreen text-custom-black py-2 px-4 rounded-full">
              <Link href="/feed/music/propose">
                Propose it now
              </Link>
            </Button>
          </div>
        ) : (
          <MusicGrid
            tracks={tracks}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </div>
      <div className='flex flex-row gap-4'>
        <Button asChild className="bg-custom-lightGreen text-custom-black h-10 py-4 px-6 rounded-full w-full mt-4 mb-10 text-center">
          <Link href="/feed/music/propose">
            Propose your song
          </Link>
        </Button>
        <Button
          asChild
          className="bg-custom-lightGreen text-custom-black h-10 py-4 px-6 rounded-full w-full mt-4 mb-10 text-center"
          onClick={handleVotesClick}
        >
          <Link href={authenticated ? `/feed/${user?.wallet?.address}` : '#'}>
            Your votes
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default MusicPage
