import Image from "next/image"
import VoteSongButton from './VoteSongButton'
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
  rank: number | null;
  spotify_id: string;
}


function SongListItem({ track, params, hideVoteButton }: {
  track: Track,
  params: { org: string },
  hideVoteButton?: boolean
}) {
  return (
    <div className="flex mb-2 h-16">
      <div className={`flex items-center justify-center min-w-16 border border-custom-lightGreen ${
        track.rank && track.rank <= 20 ? 'bg-custom-darkPurple' : 'bg-custom-darkGreen'
      } text-custom-lightGreen font-bold text-2xl rounded-lg mr-2`}>
        {track.rank ? `#${track.rank.toString().padStart(2, '0')}` : 'N/A'}
      </div>
      <div className="flex justify-between flex-grow bg-white rounded-lg overflow-hidden">
        <div className="flex items-center flex-grow bg-white rounded-lg overflow-hidden">
          <div className="h-full min-w-16 relative">
            <Image
              src={track.imageUrl}
              alt={`${track.title} album cover`}
              fill
              className="rounded-lg border border-custom-lightGreen object-cover"
            />
          </div>
          <div className="flex-grow px-3 py-2 text-left max-w-[70%]">
            <h3 className="font-bold text-custom-dark truncate">
              {track.title}
            </h3>
            <p className="text-sm text-custom-dark truncate">
              {track.artist}
            </p>
          </div>
        </div>
        <div className="flex pr-2 min-w-12 justify-end items-center">
          {!hideVoteButton && (
            <VoteSongButton trackId={track.spotify_id} params={params} />
          )}
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
  params: { org: string };
  hideVoteButton?: boolean;
}

export default function MusicGrid({
  tracks,
  isLoading,
  fetchNextPage,
  hasNextPage,
  params,
  hideVoteButton
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
    <div className="flex h-[280px] flex-col flex-grow bg-transparent overflow-y-auto scrollbar-thin scrollbar-thumb-custom-lightGreen scrollbar-track-custom-darkGreen">
      <div className="flex-grow">
        {tracks.map((track) => (
          track?.id && <SongListItem
            key={track?.id}
            track={track}
            params={params}
            hideVoteButton={hideVoteButton}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && hasNextPage && tracks.length > 0 && (
          <div className="text-center py-2 text-custom-lightGreen text-sm">
            Loading...
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
