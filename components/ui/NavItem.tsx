'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { memo } from 'react'

interface NavItemProps {
  icon: string;
  href: string;
}

// Memoize the component to prevent unnecessary re-renders
const NavItem = memo(function NavItem({ icon, href }: NavItemProps) {
  const pathname = usePathname()
  // Simplified active check
  const isActive = pathname.startsWith(href)
  
  // Pre-compute the filter style
  const filterStyle = isActive
    ? 'brightness(0) saturate(100%) invert(88%) sepia(61%) saturate(1011%) hue-rotate(42deg) brightness(104%) contrast(103%)'
    : 'brightness(0) invert(1)'

  return (
    <Link 
      href={href} 
      prefetch={true}
      className={`p-4 ${isActive ? 'text-custom-lightGreen' : 'text-white'}`}
    >
      <Image
        src={icon}
        alt=""
        width={24}
        height={24}
        priority
        style={{ filter: filterStyle }}
      />
    </Link>
  )
})

export default NavItem
