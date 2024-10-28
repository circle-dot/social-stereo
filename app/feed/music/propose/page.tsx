import React from 'react'
import SearchToPropose from '@/components/ui/music/SearchToPropose'

function ProposeMusicPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
            <h1 className='text-xl font-semibold'>Add your favourite song</h1>
            <SearchToPropose />
        </div>
    )
}

export default ProposeMusicPage
