"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

function StyledButton({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname()
    console.log(pathname)
  return (
    <Link href={href} className='w-fit'>
    <Button className='py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg'>
      {children}
    </Button>
  </Link>
  )
}

export default StyledButton