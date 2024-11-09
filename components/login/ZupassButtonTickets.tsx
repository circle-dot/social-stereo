"use client"
import React from 'react'
import { zuAuthRedirect } from '@pcd/zuauth'
import { whitelistedTickets } from '@/components/login/config/zupass-tickets-config'
import { TicketTypeName } from '@/components/login/config/zupass-tickets-config'
import Swal from 'sweetalert2'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'

interface Props {
  org: string;
}

export function ZupassButtonTickets({ org }: Props) {
  const { authenticated, ready } = usePrivy()

  const handleZuAuth = async () => {
    try {
      const watermark = "0";

      // Find the matching config key case-insensitively
      const configKey = Object.keys(whitelistedTickets).find(
        key => key.toLowerCase() === org.toLowerCase()
      ) as TicketTypeName | undefined;

      if (!configKey) {
        throw new Error(`No ticket configuration found for ${org}`);
      }

      const orgConfig = whitelistedTickets[configKey];

      await zuAuthRedirect({
        returnUrl: `${window.location.origin}/${org}/login/zupass`,
        watermark,
        config: orgConfig,
        fieldsToReveal: {
          revealAttendeeEmail: true,
          revealEventId: true,
          revealProductId: true,
          revealAttendeeSemaphoreId: true,
        },
        proofTitle: "Connect with Zupass",
        proofDescription: "**Connect your Zupass to Stamp Network**",
      });
    } catch (error) {
      console.error('ZuAuth error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to initiate Zupass verification',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Button
      className={`py-2 px-8 rounded-full gap-3 ${!authenticated
          ? 'bg-gray-300'
          : 'bg-custom-lightGreen'
        } text-black text-base md:text-lg`}
      onClick={handleZuAuth}
      disabled={!ready || !authenticated}
    >
      {!authenticated ? (
        <>Connect wallet first ↑</>
      ) : (
        <>Validate Zupass <MoveRight className='w-4 h-4' /></>
      )}
    </Button>
  );
}