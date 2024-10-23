import React from 'react'
import SearchToPropose from '@/components/ui/music/SearchToPropose'
import Image from 'next/image'
import SpotifyLogo from '@/public/Spotify_Full_Logo_RGB_Green.png'

function ProposeMusicPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
            <h1 className='text-xl font-semibold'>Add your favourite song</h1>
            <h2 className="text-base mb-6">Powered by <a href="https://open.spotify.com"><Image width={100} height={90} src={SpotifyLogo} alt='Spotify logo' /></a></h2>
            <SearchToPropose />
        </div>
    )
}

export default ProposeMusicPage
