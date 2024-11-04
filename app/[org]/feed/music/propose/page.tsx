"use client"
import React, { Suspense } from 'react'
import SearchToPropose from '@/components/ui/music/SearchToPropose'
import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
  params: {
    org: string
  }
}

function ProposeMusicContent({ params }: PageProps) {
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ''
    
    const orgName = params.org
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
            <div className='flex flex-col items-center justify-center mb-6'>
                <h1 className='text-xl font-semibold'>Add your favorite song to {orgName}</h1>
                <h2>Make it to the playlist!</h2>
            </div>
            <SearchToPropose initialSearch={initialSearch} params={params} />
        </div>
    )
}

function LoadingFallback() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
            <div className='flex flex-col items-center justify-center mb-6'>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-36" />
            </div>
            <Skeleton className="w-full max-w-md h-10 rounded-full" />
        </div>
    )
}

export default function ProposeMusicPage({ params }: PageProps) {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ProposeMusicContent params={params} />
        </Suspense>
    )
}