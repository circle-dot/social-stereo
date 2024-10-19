'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import navIcon from '@/public/navIcon.svg'
import navIcon2 from '@/public/navIcon2.svg'
import navIcon3 from '@/public/navIcon3.svg'
import navIcon4 from '@/public/navIcon4.svg'

interface NavItemProps {
  icon: string;
  href: string;
}

function NavItem({ icon, href }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className="flex flex-col items-center">
      <div className={`${isActive ? 'text-custom-lightGreen' : 'text-white'}`}>
        <Image 
          src={icon} 
          alt="Navigation icon" 
          width={30} 
          height={30} 
          className="w-6 h-6"
          style={{ 
            filter: isActive ? 'brightness(0) saturate(100%) invert(88%) sepia(19%) saturate(1640%) hue-rotate(41deg) brightness(104%) contrast(106%)' : 'brightness(0) invert(1)'
          }}
        />
      </div>
    </Link>
  )
}

export default function MainNavigation() {
  const params = useParams()
  const projectName = params.project as string
  const pathname = usePathname()
  const isMusicRoute = pathname === `/${projectName}/music`

  return (
    <div className="fixed bottom-4 left-4 right-4 ">
      {isMusicRoute && (
        <div className='absolute left-1/2 transform -translate-x-1/2 -top-16 bg-white h-full w-full flex justify-center items-center'>
          <Link href={`/${projectName}/music/propose`}>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Propose your song
            </Button>
          </Link>
        </div>
      )}
      <nav className="bg-custom-darkGreen border border-gray-800 rounded-3xl relative shadow-lg">
        <div className="flex justify-around items-center h-16 px-4">
          <NavItem icon={navIcon} href={`/${projectName}/feed`} />
          <NavItem icon={navIcon2} href={`/${projectName}/feed/music`} />
          <NavItem icon={navIcon3} href={`/${projectName}/feed/karaoke`} />
          <NavItem icon={navIcon4} href={`/${projectName}/feed/dj`}/>
        </div>
      </nav>
    </div>
  )
}
