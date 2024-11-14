import { Headphones, MoveRight, Music } from 'lucide-react';
import StampCollection from '@/components/devcon/stamps/StampCollection';
import Link from 'next/link';

interface PageProps {
  params: {
    org: string
  }
}

export default function HomePage({ params }: PageProps) {
  const orgName = params.org
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="flex flex-col flex-grow w-full h-full max-w-2xl mx-auto px-4">
      <div className="max-w-4xl">
        <h1 className='!font-extrabold text-2xl md:text-3xl lg:text-4xl pb-2'>
          Welcome to {orgName}
        </h1>
        <p>This app lets you vote for your favorite music and collect stamps. An artifact with all the decentralized playlist will be minted once the event is over.</p>
        <StampCollection />
      </div>
      
      <div className="flex flex-col gap-4">
        <Link 
          href={`/${params.org}/feed/music`}
          prefetch={true}
          className="bg-custom-darkGreen rounded-xl p-4 flex flex-col space-y-2 max-w-lg hover:bg-custom-darkGreen/90 transition-colors duration-200"
        >
          <div className="text-2xl text-custom-lightGreen">
            <Headphones />
          </div>
          <h2 className="text-lg font-semibold text-white">Decentralized Playlist</h2>
          <p className="text-xs text-gray-300">Vote for the music you like to contribute to the playlist.</p>
          <div className="py-2 px-8 rounded-full gap-3 inline-flex items-center justify-center bg-custom-lightGreen text-black text-base md:text-lg hover:bg-custom-lightGreen/50 hover:text-custom-white transition-colors duration-200">
            Curate playlist <MoveRight className='w-3 h-3 ml-2' />
          </div>
        </Link>

        <a 
          href="https://open.spotify.com/playlist/557Ufv5mviacUVDrfT8l07?si=QObSWgiASDK_JW9El-F3gA"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-custom-darkGreen rounded-xl p-4 flex flex-col space-y-2 max-w-lg hover:bg-custom-darkGreen/90 transition-colors duration-200"
        >
          <div className="text-2xl text-custom-lightGreen">
            <Music />
          </div>
          <h2 className="text-lg font-semibold text-white">Listen on Spotify</h2>
          <p className="text-xs text-gray-300">Check out the current top 20 tracks on Spotify.</p>
          <div className="py-2 px-8 rounded-full gap-3 inline-flex items-center justify-center bg-custom-lightGreen text-black text-base md:text-lg hover:bg-custom-lightGreen/50 hover:text-custom-white transition-colors duration-200">
            Play top 20 <MoveRight className='w-3 h-3 ml-2' />
          </div>
        </a>
      </div>
    </div>
  );
}
