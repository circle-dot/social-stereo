import Image from "next/image"
import VoteSongButton from './VoteSongButton'
import { Skeleton } from "@/components/ui/skeleton"
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
  createdAt: string;
  rank: number;
  spotify_id: string;
}

function SongSkeleton() {
  return (
    <div className="flex items-stretch mb-2 h-16">
      <Skeleton className="w-16 h-full rounded-lg mr-2" />
      <div className="flex items-center flex-grow bg-white rounded-lg overflow-hidden">
        <Skeleton className="h-full w-16" />
        <div className="flex-grow px-3 py-2">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="pr-2">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function SongListItem({ track }: { track: Track }) {
  const truncate = (str: string, maxLength: number) => 
    str.length > maxLength ? str.slice(0, maxLength) + '...' : str;

  return (
    <div className="flex items-stretch mb-2 h-16">
      <div className="flex items-center justify-center w-16 border border-custom-lightGreen bg-custom-darkGreen text-custom-lightGreen font-bold text-2xl rounded-lg mr-2">
        #{track.rank.toString().padStart(2, '0')}
      </div>
      <div className="flex items-center flex-grow bg-white rounded-lg overflow-hidden">
        <div className="h-full w-16 relative">
          <Image
            src={track.imageUrl}
            alt={`${track.title} album cover`}
            fill
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
          <VoteSongButton trackId={track.spotify_id} />
        </div>
      </div>
    </div>
  )
}

interface MusicGridProps {
  tracks: Track[];
  isLoading: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
}

export default function MusicGrid({ 
  tracks, 
  isLoading, 
  fetchNextPage, 
  hasNextPage 
}: MusicGridProps) {
  // Set up intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoading && fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isLoading, fetchNextPage]);

  return (
    <div className="w-full h-[300px] bg-transparent overflow-y-auto scrollbar-thin scrollbar-thumb-custom-lightGreen scrollbar-track-custom-darkGreen">
      <div className="w-full">
        {tracks.map((track) => (
          <SongListItem key={track.id} track={track} />
        ))}
        
        {isLoading && (
          <div className="w-full">
            {[...Array(2)].map((_, i) => (
              <SongSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Intersection observer target */}
        {hasNextPage && (
          <div ref={ref} className="h-10" />
        )}
      </div>
    </div>
  )
}
