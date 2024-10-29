"use client"
import React, { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { zuAuthPopup } from '@pcd/zuauth'
import { whitelistedTickets } from '@/components/zupass/megazu/mega-config'
import { TicketTypeName } from '@/components/zupass/megazu/mega-config'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation';

function LoginPage() {
  const { login, ready, authenticated,getAccessToken, user } = usePrivy()
  const [step, setStep] = useState<'privy' | 'zuauth'>(() => 
    authenticated ? 'zuauth' : 'privy'
  )
  const router = useRouter();

  // When authentication status changes, update the step
  useEffect(() => {
    if (authenticated) {
      setStep('zuauth')
    }
  }, [authenticated])

  const handlePrivyLogin = async () => {
    try {
      await login()
      setStep('zuauth')
    } catch (error) {
      console.error('Privy login error:', error)
    }
  }

  const handleZuAuth = async () => {
    Swal.fire({
      title: 'Verifying...',
      text: 'Please wait while we verify your Zupass ticket',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    try {
      // const watermarkResponse = await fetch('/api/watermark');
      // const { watermark } = await watermarkResponse.json();
      const watermark = "0";
      const config = Object.entries(whitelistedTickets).flatMap(
        ([ticketType, tickets]) =>
            tickets
                .map((ticket) => {
                    if (ticket.eventId && ticket.productId) {
                        return {
                            pcdType: ticket.pcdType,
                            ticketType: ticketType as TicketTypeName,
                            eventId: ticket.eventId,
                            productId: ticket.productId,
                            eventName: ticket.eventName || "",
                            productName: ticket.productName || "",
                            publicKey: ticket.publicKey
                        };
                    }
                    console.error("Invalid ticket format:", ticket);
                    return null;
                })
                .filter(
                    (ticket): ticket is NonNullable<typeof ticket> => ticket !== null
                )
      );
      const result = await zuAuthPopup({
        fieldsToReveal: {
          revealAttendeeEmail: true,
          revealAttendeeName: true,
          revealEventId: true,
          revealProductId: true,
          revealAttendeeSemaphoreId: true,
          revealTicketCategory: true
        },
        returnUrl: window.location.origin,
        watermark,
        config,
        multi: true
      });

      if (result && result.type === "multi-pcd" && Array.isArray(result.pcds)) {
        console.log(result.pcds)
        const pcds = result.pcds
        // Send the PCD to your verification endpoint
        const token = await getAccessToken(); 
        const verifyResponse: Response = await fetch('/api/verifyZupass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ pcds: pcds, user: user }),
        });

        if (!verifyResponse.ok) {
          throw new Error('Verification failed');
        }

        const {  nullifier } = await verifyResponse.json();
          // Check if the user has a valid ticket
       
        await Swal.fire({
          icon: 'success',
          title: 'Welcome to SocialStereo!',
          text: 'Successfully signed up. Redirecting...',
          timer: 2000,
          showConfirmButton: false,
          didClose: () => {
            router.push('/feed/music');
          }
        });

        // Store the authenticated user data (you might want to use a state management solution)
        console.log('Authenticated user:', user);
        console.log('Nullifier:', nullifier);

      }
    } catch (error) {
      console.error('ZuAuth error:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: 'There was an error verifying your Zupass ticket. Please try again.',
        confirmButtonText: 'OK'
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-8 text-3xl font-bold">Welcome to SocialStereo</h1>
        
        {!authenticated && step === 'privy' && (
          <>
            <h2 className="mb-4 text-xl">Step 1: Login with Privy</h2>
            <button
              onClick={handlePrivyLogin}
              className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
              disabled={!ready}
            >
              {!ready ? 'Loading...' : 'Sign in with Privy'}
            </button>
          </>
        )}

        {step === 'zuauth' && authenticated && (
          <>
            <h2 className="mb-4 text-xl">Verify with Zupass</h2>
            <button
              onClick={handleZuAuth}
              className="rounded-lg bg-green-500 px-6 py-3 text-white hover:bg-green-600"
            >
              Connect your Zupass
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginPage
