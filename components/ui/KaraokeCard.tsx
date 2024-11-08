import React from 'react'
import StyledButton from '@/components/ui/StyledButton'
import { MoveRight, Info } from 'lucide-react'

interface KaraokeCardProps {
  title: string;
  description: string;
  href: string;
}

function KaraokeCard({ title, description, href }: KaraokeCardProps) {
  return (
    <div className="bg-custom-darkGreen rounded-3xl p-6 flex flex-col space-y-3 max-w-lg text-left">
      <div className="flex items-center justify-between">
      <p className="text-2xl text-custom-lightGreen">🎤</p>
        <p><Info /></p>
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-sm text-gray-300">{description}</p>
      <StyledButton 
        href={href} 
        className="mt-4 bg-custom-lightGreen text-black px-6 py-3 rounded-full hover:opacity-90 inline-flex items-center"
      >
        Claim <MoveRight className="w-4 h-4 ml-1" />
      </StyledButton>
    </div>
  )
}

export default KaraokeCard