"use client"
import React from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'

function page() {
    const { logout } = usePrivy();
  return (
    <div>
        <Button onClick={logout}>Logout</Button>
    </div>
  )
}

export default page