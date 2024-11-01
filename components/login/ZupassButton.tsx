"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import { connect, ParcnetAPI, Zapp } from "@parcnet-js/app-connector"
import { ticketProofRequest } from "@parcnet-js/ticket-spec"
import { usePrivy } from '@privy-io/react-auth'

function ZupassButton() {
    const { getAccessToken } = usePrivy()
    const [isLoading, setIsLoading] = useState(false)
    const connectorRef = useRef<HTMLDivElement>(null)

    const handleZupassLogin = async () => {
        setIsLoading(true)
        try {
            const myApp: Zapp = {
                name: "Devcon Ticket Authentication",
                permissions: {
                    REQUEST_PROOF: { collections: ["Tickets"] },
                    READ_PUBLIC_IDENTIFIERS: {}
                },
            }

            const api = await connect(
                myApp,
                connectorRef.current!,
                "https://zupass.org"
            )
            await verifyTicket(api)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const verifyTicket = async (api: ParcnetAPI) => {
        try {
            const req = ticketProofRequest({
                classificationTuples: [
                    {
                        signerPublicKey: "YwahfUdUYehkGMaWh0+q3F8itx2h8mybjPmt8CmTJSs",
                        eventId: "5074edf5-f079-4099-b036-22223c0c6995",
                    },
                ],
                fieldsToReveal: {
                    attendeeEmail: true,
                    attendeeName: true,
                    eventId: true,
                },
            })

            const proofData = await api?.gpc.prove({ 
                request: req.schema, 
                collectionIds: ["Tickets"] 
            })

            if (!proofData) {
                throw new Error('Failed to generate proof')
            }

            if (!api) return;
            const semaphoreIdentity = await api.identity.getSemaphoreV4Commitment();
            const commitment = semaphoreIdentity.toString()
            const token = await getAccessToken()
            
            // Create the request body by spreading the proofData and adding semaphoreIdentity
            const requestBody = {
                ...proofData,
                commitment
            }
            
            const response = await fetch('/api/verifyPOD', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to verify proof')
            }

            const result = await response.json()
            console.log('Verification result:', result)
        } catch (error) {
            console.error('Verification error:', error)
        }
    }

    return (
        <>
            <div ref={connectorRef} style={{ width: '0', height: '0', overflow: 'hidden' }}></div>
            <Button 
                className={`py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg`} 
                onClick={handleZupassLogin}
                disabled={isLoading}
            >
                Validate Devcon Ticket <MoveRight className='w-4 h-4' />
            </Button>
        </>
    )
}

export default ZupassButton