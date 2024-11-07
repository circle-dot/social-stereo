"use client"
import React from 'react'
import PrivyButton from '@/components/login/PrivyButton'
import { ZupassButtonTickets } from '@/components/login/ZupassButtonTickets'
import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Login({
  params
}: {
  params: { org: string }
}) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const { ready, user, getAccessToken } = usePrivy()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const wallet = user?.wallet?.address
  useEffect(() => {
    const checkPretrust = async () => {
      console.log('wallet state:', wallet)
      if (!wallet) return
  const token = await getAccessToken()
      setIsVerifying(true)
      console.log('checking pretrust')
      try {
        const response = await fetch('/api/checkPretrust', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ wallet, community: params.org })
        })
        const data = await response.json()
        setIsVerified(!!data.decodedDataJson)
      } catch (error) {
        console.error('Error checking pretrust:', error)
      } finally {
        setIsVerifying(false)
      }
    }

    checkPretrust()
    console.log('isVerified', isVerified)
  }, [wallet, params.org])

  return (
    <div className="p-6 flex flex-col gap-8 min-h-screen">
      <div className="flex-1 flex items-center">
        <div className='gap-y-10 flex flex-col'>
          <section>
            <h1 className='!font-extrabold text-4xl'>Connect Wallet</h1>
            <p className='text-regular font-normal my-4 md:text-lg lg:text-xl'>
              Play and experiment with the Ethereum stack and Programable Cryptography. Use Zupass, EAS and Stamp to vouch for songs, DJs and Karaoke enthusiasts.
            </p>        
            <PrivyButton />
          </section>
          
          <section>
            <h1 className='!font-extrabold text-4xl'>Connect Zupass</h1>
            <p className='text-regular font-normal my-4 md:text-lg lg:text-xl'>
              Play and experiment with the Ethereum stack and Programable Cryptography. Use Zupass, EAS and Stamp to vouch for songs, DJs and Karaoke enthusiasts.
            </p>        
            {isVerifying ? (
              <Button className='hover:cursor-wait py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg'>
                Verifying zupass...
                </Button>
            ) : isVerified ? (
              <Button className='hover:cursor-default py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg'>
                Zupass verified! ✅
              </Button>
            ) : (
                <ZupassButtonTickets 
                  org={params.org}
                />
            )}
            {isVerified && (
             <div className='flex justify-start items-center pt-4 animate-pulse'>
               <Link 
                href={`/${params.org}/feed/music`}
                className="inline-block mt-4 py-2 px-8 rounded-full bg-custom-lightGreen text-black text-base md:text-lg hover:bg-opacity-90 transition-all"
              >
                Start vouching for music →
              </Link>
             </div>
            )}
          </section>
        </div>
      </div>

    </div>
  )
}

export default Login