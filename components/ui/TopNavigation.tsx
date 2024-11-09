"use client"
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import ProfileAvatar from './ProfileAvatar'
import Link from 'next/link'

function TopNavigation({ params, profile }: { params?: { org: string }, profile?: boolean }) {
    const { ready, authenticated, user } = usePrivy();

    return (
        <div className="w-full flex justify-between items-center p-4">
            <div>
                <ArrowLeft
                    className='text-custom-lightGreen cursor-pointer'
                    onClick={() => window.history.back()}
                />
            </div>
            {!profile && <div>
                {ready && authenticated && user && (
                    <Link href={`/${params?.org}/address/${user?.wallet?.address}`}>
                        {ProfileAvatar(user?.wallet?.address || '', "w-10 h-10 hover:cursor-pointer")}
                    </Link>
                )}
            </div>}
        </div>
    )
}

export default TopNavigation
