'use client'
import React, { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { showAlertWithRedirect } from '@/utils/alertUtils'

function ZupassVerification({ params }: { params: { org: string } }) {
  const { ready, authenticated, user, getAccessToken } = usePrivy()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true)
  const [hasStartedVerification, setHasStartedVerification] = useState(false)

  useEffect(() => {
    const verifyProof = async () => {
      if (hasStartedVerification) return;
      setHasStartedVerification(true);

      if (!ready || !authenticated || !user) {
        await showAlertWithRedirect(
          'Authentication required',
          'Back to Login',
          `/${params.org}/login`,
          true
        )
        return
      }

      const urlParams = new URLSearchParams(window.location.search)
      const proofFromUrl = urlParams.get("proof")

      if (!proofFromUrl) {
        await showAlertWithRedirect(
          'No proof found',
          'Back to Login',
          `/${params.org}/login`,
          true
        )
        return
      }

      try {
        const token = await getAccessToken()
        const parsedProof = JSON.parse(proofFromUrl)
        
        const verifyResponse = await fetch('/api/verifyZupass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            pcds: [parsedProof],
            user 
          }),
        })

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          
          // Check if the error is about POD already being registered
          if (errorData.details && errorData.details.includes('POD is already registered')) {

            
            await showAlertWithRedirect(
              'This Zupass ticket has already been used with another account.',
              'Back to Login',
              `/${params.org}/login`,
              true
            );
            return;
          }
          
          throw new Error(errorData.error || 'Verification failed');
        }

        await showAlertWithRedirect(
          'Successfully verified your Zupass ticket!',
          'Continue to Feed',
          `/${params.org}/feed/home`,
          false
        )
      } catch (error) {
        console.error('Proof verification error:', error)
        await showAlertWithRedirect(
          'There was an error verifying your Zupass ticket. Please try again.',
          'Back to Login',
          `/${params.org}/login`,
          true
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (ready && !hasStartedVerification) {
      verifyProof()
    }
  }, [ready, authenticated, user, getAccessToken, params.org, hasStartedVerification])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">⚡</div>
        <h1 className="text-2xl font-bold mb-2">Verifying your Zupass ticket...</h1>
        <p className="text-white">Please wait while we process your verification</p>
      </div>
    </div>
  )
}

export default ZupassVerification