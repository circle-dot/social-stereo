import React from 'react'
import StyledButton from '@/components/ui/StyledButton'

function page() {
  return (
    <div className=" p-6 flex flex-col items-center text-center relative">

      <h3 className="text-custom-lightGreen mb-2">
        Karaoke
      </h3>
      
      <h1 className="text-white text-4xl font-bold mb-4 max-w-md">
        How to sign up a friend for Karaoke
      </h1>
      
      <p className="text-gray-200 mb-8">
        Follow the instructions below to be able to sing
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-md text-left">
        <div className="bg-custom-darkGreen rounded-2xl p-4 border border-custom-lightGreen">
          <h2 className="text-custom-lightGreen text-lg font-semibold mb-2">Step 1</h2>
          <p className="text-gray-200">
            Lorem ipsum dolor sit amet consectetur. Purus ullamcorper cum non nibh neque non et consequat. Egestas volutpate placerat.
          </p>
        </div>

        <div className="bg-custom-darkGreen rounded-2xl p-4 border border-custom-lightGreen">
          <h2 className="text-custom-lightGreen text-lg font-semibold mb-2">Step 2</h2>
          <p className="text-gray-200">
            Lorem ipsum dolor sit amet consectetur. Purus ullamcorper cum non nibh neque non et consequat. Egestas volutpate placerat.
          </p>
        </div>

        <div className="bg-custom-darkGreen rounded-2xl p-4 border border-custom-lightGreen">
          <h2 className="text-custom-lightGreen text-lg font-semibold mb-2">Step 3</h2>
          <p className="text-gray-200">
            Lorem ipsum dolor sit amet consectetur. Purus ullamcorper cum non nibh neque non et consequat. Egestas volutpate placerat.
          </p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-md">
     
      </div>
    </div>
  )
}

export default page