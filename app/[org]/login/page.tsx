"use client"
import React from 'react'
import PrivyButton from '@/components/login/PrivyButton'
import { ZupassButtonTickets } from '@/components/login/ZupassButtonTickets'
import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AboutDialog } from '@/components/devcon/popup/AboutDialog'

function Login({
  params
}: {
  params: { org: string }
}) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const { user, getAccessToken } = usePrivy()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const wallet = user?.wallet?.address
  const [showAboutDialog, setShowAboutDialog] = useState(false)

  useEffect(() => {
    const hideDialog = localStorage.getItem('hideAboutDialog')
    if (!hideDialog) {
      setShowAboutDialog(true)
    }
  }, [])

  useEffect(() => {
    const checkPretrust = async () => {
      console.log('wallet state:', wallet)
      if (!wallet) return
      const token = await getAccessToken()
      setIsVerifying(true)
      try {
        const response = await fetch('/api/checkPretrust', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ wallet, community: params.org })
        })
        const data = await response.json()
        console.log("🚀 ~ checkPretrust ~ data:", data)
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
    <>
      <AboutDialog 
        open={showAboutDialog} 
        onOpenChange={setShowAboutDialog}
      />
      <div className="p-6 flex flex-col gap-8 min-h-screen">
        <div className="flex-1 flex items-center">
          <div className='gap-y-10 flex flex-col'>
            <section>
              <h1 className='!font-extrabold text-4xl'>Connect Wallet</h1>
              <p className='text-regular font-normal my-4 md:text-lg lg:text-xl'>
                Connect your existing wallet or create a new one using any email.
                This address will be used for your badges and it doesn&apos;t need to be related to your Zupass account.
              </p>
              <PrivyButton />
            </section>

            <section>
              <h1 className='!font-extrabold text-4xl'>Connect Zupass</h1>
              <p className='text-regular font-normal my-4 md:text-lg lg:text-xl'>
                Connect to verify your DevCon ticket.
              </p>
              {isVerifying ? (
                <Button className='hover:cursor-wait py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg'>
                  Verifying zupass...
                </Button>
              ) : isVerified ? (
                <Button disabled className='hover:cursor-default py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg'>
                  Zupass verified! <span className="ml-1">✓</span>
                </Button>
              ) : (
                <ZupassButtonTickets
                  org={params.org}
                />
              )}
              {isVerified && (
                <div className='flex justify-start items-center pt-4'>
                  <Link
                    href={`/${params.org}/feed/music`}
                    className="group relative inline-flex items-center justify-center mt-4 py-3 px-8 
                      rounded-full bg-custom-lightGreen text-black font-semibold text-base md:text-lg
                      overflow-hidden transition-all duration-300 ease-in-out
                      hover:shadow-[0_0_20px_rgba(180,255,76,0.4)] 
                      hover:scale-105 
                      active:scale-95"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Shape the Playlist
                      <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full 
                      transition-transform duration-300 group-hover:translate-y-0"
                    />
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login