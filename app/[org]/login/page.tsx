"use client"
import React from 'react'
import StyledButton from '@/components/ui/StyledButton'
import { MoveRight } from 'lucide-react'
import PrivyButton from '@/components/login/PrivyButton'
import ZupassButtonPOD from '@/components/login/ZupassButtonPOD'
import { ZupassButtonTickets } from '@/components/login/ZupassButtonTickets'
import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'

function Login({
  params
}: {
  params: { org: string }
}) {
  const { authenticated } = usePrivy()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isZupassVerified, setIsZupassVerified] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [wallet, setWallet] = useState<string | null>(null)

  // Check if both conditions are met to enable the continue button
  const isContinueEnabled = authenticated && (isVerified || isZupassVerified)

  useEffect(() => {
    const checkPretrust = async () => {
      if (!wallet) return
      
      setIsVerifying(true)
      try {
        const response = await fetch('/api/checkPretrust', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            <h1 className='!font-extrabold text-4xl'>Stamp Passport</h1>
            <p className='text-regular font-normal my-4 md:text-lg lg:text-xl'>
              Play and experiment with the Ethereum stack and Programable Cryptography. Use Zupass, EAS and Stamp to vouch for songs, DJs and Karaoke enthusiasts.
            </p>        
            {isVerifying ? (
              <div>Verifying stamp...</div>
            ) : isVerified ? (
              <div>Stamp verified! ✅</div>
            ) : (
              params.org === 'Devcon' ? 
                <ZupassButtonPOD onVerified={(verified) => setIsZupassVerified(verified)} /> : 
                <ZupassButtonTickets onVerified={(verified) => setIsZupassVerified(verified)} />
            )}
          </section>
        </div>
      </div>

      <StyledButton 
        href={`/${params.org}/feed/home`}
        disabled={!isContinueEnabled}
        className={!isContinueEnabled ? 'opacity-50 cursor-not-allowed' : ''}
      >
        Continue <MoveRight className='w-4 h-4' />
      </StyledButton>
    </div>
  )
}

export default Login