import React from 'react'
import Image from 'next/image'
import KaraokeImage from '@/public/Karaoke.png'
import { Button } from '@/components/ui/button'
function page() {
  return (
    <div className='p-6 md:p-12 flex flex-col items-center justify-start relative'>
      <div className='w-full max-w-md md:max-w-xl mx-auto'>
        <div className='relative w-full mb-6 md:w-1/2 md:mx-auto'>
          <Image 
            src={KaraokeImage} 
            alt='Karaoke' 
            width={1000} 
            height={1000} 
            className='object-contain border border-custom-lightGreen rounded-2xl' 
          />
        </div>
        
        <h1 className='text-white text-4xl md:text-5xl font-bold mb-4 text-left'>
          Ready to make all the devcon people dance?
        </h1>
        <Button className='py-2 px-8 rounded-full gap-3 bg-custom-lightGreen text-black text-base md:text-lg w-full md:w-auto md:min-w-[300px]'>
          Claim
        </Button>
      </div>
    </div>
  )
}

export default page