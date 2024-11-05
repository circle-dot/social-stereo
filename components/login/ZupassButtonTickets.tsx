"use client"
import React, { useState, useEffect } from 'react'
import { zuAuthPopup } from '@pcd/zuauth'
import { whitelistedTickets } from '@/components/login/config/zupass-tickets-config'
import { TicketTypeName } from '@/components/login/config/zupass-tickets-config'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'

interface Props {
  onVerified: (verified: boolean) => void;
}

export function ZupassButtonTickets({ onVerified }: Props) {
  const router = useRouter()
  const { user, getAccessToken, authenticated, ready } = usePrivy()
  const [isLoading, setIsLoading] = useState(true)
  const [isZupassVerified, setIsZupassVerified] = useState(false)

  useEffect(() => {
    const checkZupassVerification = async () => {
      if (!ready) return
      
      if (!authenticated) {
        setIsLoading(false)
        return
      }
  
      if (authenticated && user) {
        try {
          const token = await getAccessToken()
          const response = await fetch(`/api/user/${user.wallet?.address}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            setIsZupassVerified(true)
            onVerified(true)
          }
        } catch (error) {
          console.error('Error checking Zupass verification:', error)
        }
      }
      setIsLoading(false)
    }
  
    checkZupassVerification()
  }, [ready, authenticated, user, getAccessToken, onVerified])

  const handleZuAuth = async () => {
    setIsLoading(true)
    Swal.fire({
      title: 'Verifying...',
      text: 'Please wait while we verify your Zupass ticket',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    try {
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
              return null;
            })
            .filter((ticket): ticket is NonNullable<typeof ticket> => ticket !== null)
      );

      const result = await zuAuthPopup({
        fieldsToReveal: {
          revealAttendeeEmail: true,
          revealEventId: true,
          revealProductId: true,
          revealAttendeeSemaphoreId: true,
        },
        watermark,
        config,
        returnUrl: window.location.href,
        multi: true,
        proofTitle: "Connect with Zupass",
        proofDescription: "**Connect your Zupass to Stamp Network**",
      });

      if (result && result.type === "multi-pcd" && Array.isArray(result.pcds)) {
        const token = await getAccessToken();
        const verifyResponse = await fetch('/api/verifyZupass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ pcds: result.pcds, user }),
        });

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          throw new Error(errorData.error || 'Verification failed');
        }

        setIsZupassVerified(true)
        onVerified(true)
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
      }
    } catch (error) {
      console.error('ZuAuth error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const title = errorMessage === 'Ticket already used' 
        ? 'Ticket Already Used'
        : 'Verification Failed';
      const text = errorMessage === 'Ticket already used'
        ? 'This ticket has already been registered to another account.'
        : 'There was an error verifying your Zupass ticket. Please try again.';
      
      await Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Button 
      className={`py-2 px-8 rounded-full gap-3 ${
        isZupassVerified 
          ? 'bg-green-500' 
          : !authenticated 
            ? 'bg-gray-300' 
            : 'bg-custom-lightGreen'
      } text-black text-base md:text-lg`}
      onClick={handleZuAuth}
      disabled={!ready || !authenticated || isLoading || isZupassVerified}
    >
      {!ready || isLoading ? (
        <>
          <span className="animate-spin mr-2">⚡</span>
          Loading...
        </>
      ) : !authenticated ? (
        <>Connect wallet first ↑</>
      ) : isZupassVerified ? (
        <>Ticket Verified <span className="ml-1">✓</span></>
      ) : (
        <>Validate Zupass Ticket <MoveRight className='w-4 h-4' /></>
      )}
    </Button>
  );
}
