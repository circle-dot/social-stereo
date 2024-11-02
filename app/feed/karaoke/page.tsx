import React from 'react'
import StyledButton from '@/components/ui/StyledButton'
import KaraokeCard from '@/components/ui/KaraokeCard'

function page() {
  return (
    <div className=" p-6 flex flex-col items-center text-center relative">

      <h3 className="text-custom-lightGreen mb-2">
        Karaoke
      </h3>
      
      <h1 className="text-white text-4xl font-bold mb-4 max-w-md">
        Ready to make all the devcon people dance?
      </h1>
      
      <p className="text-gray-200 mb-8">
        Find out how to participate or invite a friend here
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-md">
        <StyledButton 
          href="/feed/karaoke/participate" 
          className="bg-custom-lightGreen text-black px-6 py-3 rounded-full w-full"
        >
          Participate in karaoke slot
        </StyledButton>
        
        <StyledButton 
          href="/feed/karaoke/propose" 
          className="bg-custom-lightGreen text-black px-6 py-3 rounded-full w-full"
        >
          Propose someone
        </StyledButton>
      </div>

      <div className="mt-8 w-full max-w-md">
        <KaraokeCard 
          title="Instant Karaoke Access"
          description="Skip the queue and go straight to the stage with your priority pass! One-time use for Cut the Line pass holders."
          href="/feed/karaoke/claim"
        />
      </div>
    </div>
  )
}

export default page