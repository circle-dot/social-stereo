import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface StyledButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

function StyledButton({ href, children, className = '', disabled }: StyledButtonProps) {
  return (
    <Link
      href={href}
      className={`w-full ${disabled ? 'pointer-events-none' : ''}`}
      prefetch={true}
    >
      <Button
        className={`py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg hover:bg-custom-lightGreen/50 hover:text-custom-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${className}`}
        disabled={disabled}
      >
        {children}
      </Button>
    </Link>
  )
}

export default StyledButton