"use client"
import React, { useState, useEffect } from 'react'
import RequestProof from '@/components/zupass/PODTicket/requestProof'
import { usePrivy } from '@privy-io/react-auth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Wallet, Shield, Loader2 } from "lucide-react"

function SignUpPage() {
  const { user, ready, authenticated, login } = usePrivy();
  const [currentStep, setCurrentStep] = useState(1);
  const [proofVerified, setProofVerified] = useState(false);

  const handleProofVerification = (success: boolean) => {
    setProofVerified(success);
    if (success) {
      setCurrentStep(3);
    }
  };

  useEffect(() => {
    if (authenticated) {
      setCurrentStep(2);
    }
  }, [authenticated]);

  const steps = [
    {
      title: "Connect Wallet",
      icon: <Wallet className="w-6 h-6" />,
      component: (
        <Button
          onClick={login}
          disabled={!ready || authenticated}
          className="w-full bg-custom-purple hover:bg-custom-purple/90 text-custom-white 
                   flex items-center justify-center gap-2 py-6 text-lg
                   disabled:bg-custom-mediumBlue/50 disabled:cursor-not-allowed
                   transition-all duration-200 ease-in-out"
        >
          {!ready ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Checking session...
            </>
          ) : authenticated ? (
            <>
              <Wallet className="h-5 w-5" />
              Wallet Connected
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              Connect Wallet
            </>
          )}
        </Button>
      )
    },
    {
      title: "Verify Proof",
      icon: <Shield className="w-6 h-6" />,
      component: <RequestProof onProofVerified={handleProofVerification} />
    },
    {
      title: "Complete",
      icon: <CheckCircle2 className="w-6 h-6" />,
      component: (
        <div className="flex items-center justify-center space-x-2 text-custom-lightGreen">
          <CheckCircle2 className="w-6 h-6" />
          <span>Sign up complete! You can now use the app.</span>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-custom-darkBlue border-custom-mediumBlue">
        <CardHeader>
          <CardTitle className="text-2xl text-custom-white text-center">
            Welcome to the Platform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index !== 0 && (
                <div className="absolute top-0 -left-2 h-full w-0.5 bg-custom-mediumBlue -translate-y-full" />
              )}
              <div className={`
                relative pl-8 
                  ${currentStep === index + 1 ? 'opacity-100' : currentStep > index + 1 ? 'opacity-75' : 'opacity-50'}
                `}>
                  <div className={`
                    absolute left-0 p-1 rounded-full 
                    ${currentStep > index + 1 ? 'bg-custom-lightGreen' : 
                    currentStep === index + 1 ? 'bg-custom-purple' : 'bg-custom-mediumBlue'}
                `}>
                  {step.icon}
                </div>
                <div className="space-y-3">
                  <h3 className={`
                    text-lg font-semibold 
                    ${currentStep > index + 1 ? 'text-custom-lightGreen' : 
                      currentStep === index + 1 ? 'text-custom-white' : 'text-custom-lightBlue'}
                  `}>
                    Step {index + 1}: {step.title}
                  </h3>
                  {currentStep === index + 1 && (
                    <div className="transition-all duration-200">
                      {step.component}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage
