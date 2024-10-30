"use client"
import React from 'react'
import SearchToPropose from '@/components/ui/music/SearchToPropose'
import { useSearchParams } from 'next/navigation'

export default function ProposeMusicPage() {
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ''

    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
            <div className='flex flex-col items-center justify-center mb-6'>
                <h1 className='text-xl font-semibold'>Add your favorite song</h1>
                <h2>Make it to the playlist!</h2>
            </div>
            <SearchToPropose initialSearch={initialSearch} />
        </div>
    )
}