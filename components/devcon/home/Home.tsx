import React from 'react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { MoveRight } from 'lucide-react';
import StyledButton from '@/components/ui/StyledButton'

function Home() {
  return (
    <div className='min-h-screen bg-custom-purple flex flex-col items-center justify-center p-4 md:flex-row md:items-center md:p-8 lg:p-12'>
      <div className='h-4/6 w-full relative md:w-5/12 lg:w-3/12 md:h-auto'>
        <Image
          src="/Header.png"
          alt="Social Stereo"
          width={1920}
          height={1080}
          priority
          className="w-full h-full object-cover rounded-2xl"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
        />
        <Skeleton className="absolute inset-0 rounded-2xl" />
      </div>
      <div className='mt-12 md:mt-0 md:w-7/12 lg:w-8/12 md:flex md:flex-col md:justify-center md:pl-8 lg:pl-12'>
        <h1 className='!font-extrabold text-2xl md:text-3xl lg:text-4xl'>Social Stereo</h1>
        <p className='text-regular font-normal my-4 md:text-lg lg:text-xl'>Lorem ipsum dolor sit amet consectetur. Lobortis orci malesuada nunc lobortis turpis proin lectus nibh.</p>
        <StyledButton href="/feed">
          Login <MoveRight className='w-4 h-4' />
        </StyledButton>
      </div>
    </div>
  )
}

export default Home
