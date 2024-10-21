import Image from "next/image"
import { SpotifyTrack } from './SearchToProposePresentational'
import VoteSongButton from './VoteSongButton'

function SongListItem({ track, rank }: { track: SpotifyTrack; rank: number }) {
  return (
    <div className="flex items-stretch mb-2 h-16">
      <div className="flex items-center justify-center w-16 border border-custom-lightGreen bg-custom-darkGreen text-custom-lightGreen font-bold text-2xl rounded-lg mr-2">
        #{rank.toString().padStart(2, '0')}
      </div>
      <div className="flex items-center flex-grow bg-white rounded-lg overflow-hidden">
        <div className="h-full w-16 relative">
          <Image
            src={track.album.images[0].url}
            alt={`${track.name} album cover`}
            fill
            className="rounded-lg border border-custom-lightGreen object-cover"
          />
        </div>
        <div className="flex-grow px-3 py-2">
          <h3 className="font-bold text-custom-dark truncate">
            {track.name}
          </h3>
          <p className="text-sm text-custom-dark truncate">
            {track.artists.map(artist => artist.name).join(', ')}
          </p>
        </div>
        <div className="pr-2">
          <VoteSongButton trackId={track.id} />
        </div>
      </div>
    </div>
  )
}

export default function MusicGrid({ tracks }: { tracks: SpotifyTrack[] }) {
  return (
    <div className="w-full">
      {tracks.map((track, index) => (
        <SongListItem key={track.id} track={track} rank={index + 1} />
      ))}
    </div>
  )
}
