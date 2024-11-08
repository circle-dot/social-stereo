"use client"
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'
import ProfileAvatar from '../ui/ProfileAvatar'
import { useParams } from 'next/navigation'
import { ethers } from 'ethers'

function TopNavigationWithoutProfile({ params }: { params: { org: string } }) {
    const { ready, authenticated, user } = usePrivy();
    const routeParams = useParams();
    const slug = routeParams.slug as string;

    return (
        <div className="w-full flex justify-between items-center p-4">
            <div>
                <ArrowLeft 
                    className='text-custom-lightGreen cursor-pointer' 
                    onClick={() => window.history.back()}
                />
            </div>
            <div>
                {ready && authenticated && user && slug && (
                    <>
                        {ethers.getAddress(slug) !== ethers.getAddress(user?.wallet?.address || '') && (
                            <Link href={`/${params.org}/address/${user?.wallet?.address}`}>
                                {ProfileAvatar(user?.wallet?.address || '', "w-10 h-10 hover:cursor-pointer")}  
                            </Link>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default TopNavigationWithoutProfile