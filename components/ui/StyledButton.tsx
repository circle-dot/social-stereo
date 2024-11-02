import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function StyledButton({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
  return (
    <Link href={href} className='w-full'>
    <Button className={`py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg ${className}`}>
      {children}
    </Button>
  </Link>
  )
}

export default StyledButton