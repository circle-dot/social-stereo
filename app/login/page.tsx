import React from 'react'
import StyledButton from '@/components/ui/StyledButton'
import { MoveRight } from 'lucide-react'
import PrivyButton from '@/components/login/PrivyButton'
import ZupassButton from '@/components/login/ZupassButton'
function Login() {
  return (
    <div className="p-6 flex flex-col gap-8 min-h-screen">
      <div className="flex-1 flex items-center">
        <div className='gap-y-10 flex flex-col'>
        <section>
      <h1 className='!font-extrabold text-4xl '>Connect Wallet</h1>
        <p className='text-regular font-normal my-4 md:text-lg lg:text-xl'>
          Play and experiment with the Ethereum stack and Programable Cryptography. Use Zupass, EAS and Stamp to vouch for songs, DJs and Karaoke enthusiasts.
        </p>        
        <PrivyButton />
      </section>

      <section>
      <h1 className='!font-extrabold text-4xl '>Devcon Ticket</h1>
        <p className='text-regular font-normal my-4 md:text-lg lg:text-xl'>
          Play and experiment with the Ethereum stack and Programable Cryptography. Use Zupass, EAS and Stamp to vouch for songs, DJs and Karaoke enthusiasts.
        </p>        
        <ZupassButton />
      </section>
        </div>
      </div>

      <StyledButton href="/feed/home">
        Continue <MoveRight className='w-4 h-4' />
      </StyledButton>
    </div>
  )
}

export default Login