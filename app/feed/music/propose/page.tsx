import React from 'react'
import SearchToPropose from '@/components/ui/music/SearchToPropose'

function ProposeMusicPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
            <div className='flex flex-col items-center justify-center mb-6'>
            <h1 className='text-xl font-semibold'>Add your favorite song</h1>
            <h2>Make it to the playlist!</h2>
            </div>
            <SearchToPropose />
        </div>
    )
}

export default ProposeMusicPage
