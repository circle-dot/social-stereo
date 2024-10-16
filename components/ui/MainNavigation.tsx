'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { Disc3, MicVocal, Headset, LucideIcon, DiscAlbum, CircleUserRound, HomeIcon, Plus } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isCenter?: boolean;
}

function NavItem({ icon: Icon, label, href, isCenter = false }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  if (isCenter) { 
    return (
      <Link href={href} className="absolute left-1/2 -translate-x-1/2 -top-7 bg-black h-16 w-16 rounded-full shadow-lg">
        <Disc3  className="text-white w-full h-full hover:animate-[spin_3s_ease-in-out_infinite]" />
      </Link>
    )
  }

  return (
    <Link href={href} className="flex flex-col items-center">
      <div className={`${isActive ? 'text-white' : 'text-gray-500'}`}>
        <Icon size={24} />
      </div>
      {label && <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>{label}</span>}
    </Link>
  )
}

export default function MainNavigation() {
  const { ready, authenticated } = usePrivy()
  const params = useParams()
  const projectName = params.project as string
  const pathname = usePathname()
  const isMusicRoute = pathname === `/${projectName}/music`

  return (
    <div className="fixed bottom-0 left-0 right-0">
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
      <nav className="bg-slate-950 border-t border-gray-800 rounded-t-3xl relative">
        <div className="flex justify-around items-center h-16 px-4">
          {/* <NavItem icon={Home} label="Home" href="/" /> */}
          <NavItem icon={HomeIcon} label="Home" href={`/${projectName}`} />
          <NavItem icon={DiscAlbum} label="Music" href={`/${projectName}/music`} />
          <NavItem icon={MicVocal} label="Karaoke" href={`/${projectName}/karaoke`} />
          <NavItem icon={Headset} label="DJ" href={`/${projectName}/dj`}/>
          {ready && authenticated && (
            <NavItem icon={CircleUserRound} label="Profile" href={`/${projectName}/profile`} />
          )}
        </div>
      </nav>
    </div>
  )
}
