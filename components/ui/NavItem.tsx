'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface NavItemProps {
  icon: string;
  href: string;
}

export default function NavItem({ icon, href }: NavItemProps) {
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
            filter: isActive 
              ? 'brightness(0) saturate(100%) invert(88%) sepia(61%) saturate(1011%) hue-rotate(42deg) brightness(104%) contrast(103%)'
              : 'brightness(0) invert(1)'
          }}
        />
      </div>
    </Link>
  )
}
