import React from 'react'
import SearchToPropose from '@/components/ui/music/SearchToPropose'
import TitleSection from '@/components/ui/TitleSection'

function ProposeMusicPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
            <TitleSection />
            <h2 className="text-2xl font-bold mb-6">Submit your song to the playlist</h2>
            <SearchToPropose />
        </div>
    )
}

export default ProposeMusicPage
