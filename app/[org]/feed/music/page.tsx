"use client"
import React, { useState, useCallback } from 'react'
import TitleSection from '@/components/ui/TitleSection'
import MusicGrid from '@/components/ui/music/MusicGrid'
import { Button } from '@/components/ui/button'
import useMusic from '@/utils/hooks/useSearchSongs'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { debounce } from 'lodash'
import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogOverlay } from '@/components/ui/dialog'

interface PageProps {
  params: {
    org: string
  }
}

export default function MusicPage({ params }: PageProps) {
  const orgName = params.org
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const { authenticated, ready, user } = usePrivy()
  const [sortOrder] = useState<'asc' | 'desc'>('asc')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data, isLoading, fetchNextPage, hasNextPage } = useMusic(
    sortOrder,
    debouncedSearchTerm,
    params.org
  );
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
    <div className="flex flex-col flex-grow w-full h-full max-w-2xl mx-auto px-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-[100]" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110] bg-custom-purple p-6 rounded-lg shadow-xl w-[90%] max-w-[400px]" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogTitle className="text-xl font-semibold text-custom-lightGreen">Login Required</DialogTitle>
                    <DialogDescription className="text-white mt-2">
                        You need to be logged in to view your votes.
                    </DialogDescription>
                    <DialogFooter className="mt-6 flex !flex-col space-y-2 !items-end w-full">
                        <div className="flex flex-col space-y-2 w-full">
                            <Link
                                href={`/${params.org}/login`}
                                onClick={() => setIsDialogOpen(false)}
                                className="w-full bg-custom-lightGreen text-custom-black hover:bg-custom-lightGreen/90 py-3 flex items-center justify-center rounded-md"
                            >
                                Log In
                            </Link>
                        </div>
                    </DialogFooter>
                </DialogContent>
      </Dialog>

      <div className="mb-4">
        <TitleSection>{orgName} Music</TitleSection>
        <p className='text-sm text-white mb-4'>Updates every π minutes ( 15 ETH blocks )</p>
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
      </div>

      <div className="flex flex-col flex-grow h-full">
        {tracks.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center flex-grow text-center py-8">
            <p className="text-white mb-4">
              Looks like this song isn&apos;t in the Top 100 yet!
            </p>
            <Button asChild className="bg-custom-lightGreen text-custom-black py-2 px-4 rounded-full hover:bg-custom-lightGreen/90">
              <Link href={`/${params.org}/feed/music/propose?search=${encodeURIComponent(searchTerm)}`}>
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
            params={params}
          />
        )}
      </div>

      <div className='flex flex-row items-center gap-4 left-0 right-0 px-4 mt-2'>
        <Button asChild className="bg-custom-lightGreen text-custom-black h-10 py-4 px-6 rounded-full w-full text-center hover:bg-custom-lightGreen/90">
          <Link href={`/${params.org}/feed/music/propose`} prefetch={true}>
            Propose your song
          </Link>
        </Button>
        <Button
          asChild
          className="bg-custom-lightGreen text-custom-black h-10 py-4 px-6 rounded-full w-full text-center hover:bg-custom-lightGreen/90"
          onClick={handleVotesClick}
        >
          <Link href={authenticated ? `/${params.org}/address/${user?.wallet?.address}` : '#'}>
            Your votes
          </Link>
        </Button>
      </div>

    </div>
  )
}
