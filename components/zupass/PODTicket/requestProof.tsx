"use client"
import React, { useEffect, useState } from 'react';
import { ticketProofRequest } from "@parcnet-js/ticket-spec";
import { connect, ParcnetAPI, Zapp } from "@parcnet-js/app-connector";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

const myApp: Zapp = {
  name: "Devcon Ticket Authentication",
  permissions: {
    REQUEST_PROOF: { collections: ["Tickets"] },
  },
};

interface RequestProofProps {
  onProofVerified?: (success: boolean) => void;
}

const RequestProof: React.FC<RequestProofProps> = ({ onProofVerified }) => {
  const [parcnetApi, setParcnetApi] = useState<ParcnetAPI>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const api = await connect(
          myApp,
          document.querySelector<HTMLDivElement>("#connector")!,
          "https://zupass.org"
        );
        setParcnetApi(api);
        setIsLoading(false);
      } catch (error) {
        console.error('Connection error:', error);
        setIsLoading(false);
      }
    };

    initializeConnection();
  }, []);

  const handleAuthenticate = async () => {
    setIsLoading(true);
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
      });

      const proof = await parcnetApi?.gpc.prove({ 
        request: req.schema, 
        collectionIds: ["Tickets"] 
      });

      if (proof?.success) {
        console.log("proof", proof)
        console.log("Proof details:", {
          email: proof.revealedClaims.pods.ticket.entries?.attendeeEmail.value,
          name: proof.revealedClaims.pods.ticket.entries?.attendeeName.value
        });
        onProofVerified?.(true);
      } else if (proof?.error) {
        console.error("Proof error:", proof.error);
        onProofVerified?.(false);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      onProofVerified?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleAuthenticate}
        disabled={isLoading || !parcnetApi}
        className="w-full bg-custom-purple hover:bg-custom-purple/90 text-custom-white 
                   flex items-center justify-center gap-2 py-6 text-lg
                   disabled:bg-custom-mediumBlue/50 disabled:cursor-not-allowed
                   transition-all duration-200 ease-in-out"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Verifying Ticket...
          </>
        ) : (
          <>
            <ShieldCheck className="h-5 w-5" />
            Verify Ticket
          </>
        )}
      </Button>
      <div id="connector" className="mt-4" />
    </div>
  );
};

export default RequestProof;
