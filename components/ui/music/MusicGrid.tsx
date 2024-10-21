import Image from "next/image"
import { ArrowUp } from 'lucide-react'
import { SpotifyTrack } from './SearchToProposePresentational'

function SongListItem({ track, rank }: { track: SpotifyTrack; rank: number }) {
  return (
    <div className="flex items-stretch mb-2">
      <div className="flex items-center justify-center w-16 h-16 bg-custom-darkGreen text-custom-lightGreen font-bold text-2xl rounded-lg mr-2">
        #{rank.toString().padStart(2, '0')}
      </div>
      <div className="flex items-center flex-grow bg-white rounded-lg px-3 py-2">
        <Image src={track.album.images[0].url} alt={`${track.name} album cover`} width={48} height={48} className="rounded-lg mr-3" />
        <div className="flex-grow">
          <h3 className="font-bold text-custom-dark">
            {track.name.length > 15 ? `${track.name.slice(0, 15)}...` : track.name}
          </h3>
          <p className="text-sm text-custom-dark">
            {track.artists.map(artist => 
              artist.name.length > 15 ? `${artist.name.slice(0, 15)}...` : artist.name
            ).join(', ')}
          </p>
        </div>
        <button className="bg-custom-lightGreen text-custom-black p-2 rounded-full w-10 h-10 flex items-center justify-center">
          <ArrowUp className="w-5 h-5" />
        </button>
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
