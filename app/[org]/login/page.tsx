"use client"
import React from 'react'

function Login() {
  return (
    <div className="p-6 flex flex-col gap-8 min-h-screen bg-custom-purple">
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <h1 className='!font-extrabold text-4xl text-custom-lightGreen'>Thank You!</h1>
        <p className='text-center text-lg mt-4 text-custom-white'>
          Thanks for participating during DevCon SEA 7 to make the best playlist.
        </p>
      </div>
    </div>
  )
}

export default Login