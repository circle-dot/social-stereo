"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'

function PrivyButton() {
    const { ready, authenticated, login } = usePrivy()
    const handlePrivyLogin = () => {
        login()
    }
    
    return (
        <Button 
            className={`py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg`} 
            onClick={handlePrivyLogin}
            disabled={!ready || authenticated}
        >
            {!ready ? (
                <>
                    <span className="animate-spin mr-2">⚡</span>
                    Loading...
                </>
            ) : authenticated ? (
                <>
                    Already connected <span className="ml-1">✓</span>
                </>
            ) : (
                <>
                    Connect wallet/email <MoveRight className='w-4 h-4' />
                </>
            )}
        </Button>
    )
}

export default PrivyButton