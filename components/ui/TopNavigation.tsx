"use client"
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import ProfileAvatar from './ProfileAvatar'
import Link from 'next/link'

function TopNavigation() {
    const { ready, authenticated, user } = usePrivy();
    const avatar = ProfileAvatar(user?.wallet?.address || '');

  return (
    <div className="w-full flex justify-between items-center p-4">
        <div>
            <ArrowLeft 
                className='text-custom-lightGreen cursor-pointer' 
                onClick={() => window.history.back()}
            />
        </div>
        <div>
            {ready && authenticated && user && (
                <Link href={`/feed/address/${user?.wallet?.address}`}>
                {avatar}  
                </Link>
            )}
        </div>
    </div>
  )
}

export default TopNavigation
