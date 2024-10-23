import Image from "next/image"
import VoteSongButton from './VoteSongButton'

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
  createdAt: string;
  rank: number;
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
          <VoteSongButton trackId={track.id} />
        </div>
      </div>
    </div>
  )
}

export default function MusicGrid({ tracks }: { tracks: Track[] }) {
  return (
    <div className="w-full">
      {tracks.map((track) => (
        <SongListItem key={track.id} track={track} />
      ))}
    </div>
  )
}
