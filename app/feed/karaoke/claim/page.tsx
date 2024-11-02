import React from 'react'
import Image from 'next/image'
import KaraokeImage from '@/public/Karaoke.png'
import { Button } from '@/components/ui/button'
function page() {
  return (
    <div className='p-6 flex flex-col items-center justify-start min-h-screen relative'>
      <div className='relative w-full h-1/3 mb-6 pt-4'>
        <Image src={KaraokeImage} alt='Karaoke' width={1000} height={1000} className='object-contain border border-custom-lightGreen rounded-2xl' />
      </div>
      <h1 className='text-white text-4xl font-bold mb-4 max-w-md text-left'>
        Ready to make all the devcon people dance?
      </h1>
      <Button className='py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg w-full'>
        Claim
      </Button>
    </div>
  )
}

export default page