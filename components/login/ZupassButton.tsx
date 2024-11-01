"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import { connect, ParcnetAPI, Zapp } from "@parcnet-js/app-connector"
import { ticketProofRequest } from "@parcnet-js/ticket-spec"
import { usePrivy } from '@privy-io/react-auth'
import { EAS_CONFIG } from '@/config/site'
import { showSuccessAlert, showErrorAlertWithSpace } from '@/utils/alertUtils'
import Swal from 'sweetalert2'

function ZupassButton() {
    const { authenticated } = usePrivy()
    const { getAccessToken } = usePrivy()
    const [isLoading, setIsLoading] = useState(false)
    const connectorRef = useRef<HTMLDivElement>(null)

    const handleZupassLogin = async () => {
        setIsLoading(true)
        try {
            Swal.fire({
                title: 'Connecting to Zupass...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

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
            Swal.close()
        } finally {
            setIsLoading(false)
        }
    }

    const verifyTicket = async (api: ParcnetAPI) => {
        try {
            Swal.fire({
                title: 'Verifying ticket...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

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

            Swal.close()

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to verify proof')
            }

            const result = await response.json()
            console.log('Verification result:', result)

            if (result.status === 'ALREADY_REGISTERED') {
                // Show an informational alert for already registered tickets
                showErrorAlertWithSpace(
                    'Ticket Already Registered',
                    'This ticket has already been verified and cannot be used again.'
                );
            } else {
                // Show success message with attestation link for new verifications
                const baseUrl = EAS_CONFIG.GRAPHQL_URL.replace('/graphql', '');
                const attestationViewUrl = `${baseUrl}/attestation/view/${result.newAttestationUID}`;
                showSuccessAlert('Ticket verified successfully.', 'View transaction', attestationViewUrl);
            }
        } catch (error) {
            console.error('Verification error:', error)
            Swal.close()
        }
    }

    return (
        <>
            <div ref={connectorRef} style={{ width: '0', height: '0', overflow: 'hidden' }}></div>
            <Button 
                className={`py-2 px-8 rounded-full gap-3 ${!authenticated ? 'bg-gray-300' : 'bg-custom-lightGreen'} text-black text-base md:text-lg`} 
                onClick={handleZupassLogin}
                disabled={isLoading || !authenticated}
            >
                {!authenticated ? (
                    'Connect wallet first ↑'
                ) : (
                    <>Validate Devcon Ticket <MoveRight className='w-4 h-4' /></>
                )}
            </Button>
        </>
    )
}

export default ZupassButton