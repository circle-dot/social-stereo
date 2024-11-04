"use client"
import React from 'react'
import { zuAuthPopup } from '@pcd/zuauth'
import { whitelistedTickets } from '@/components/login/config/zupass-tickets-config'
import { TicketTypeName } from '@/components/login/config/zupass-tickets-config'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'


export function ZupassButtonTickets() {
  const router = useRouter()
  const { user, getAccessToken } = usePrivy()
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
        multi: true
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
    }
  };

  return (
    <button
      onClick={handleZuAuth}
      className="rounded-lg bg-green-500 px-6 py-3 text-white hover:bg-green-600"
    >
      Connect your Zupass
    </button>
  );
}
