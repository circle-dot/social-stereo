"use client"
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import ProfileAvatar from './ProfileAvatar'

function TopNavigation() {
   const avatar= ProfileAvatar("Test") 
  return (
    <div className="w-full flex justify-between items-center p-4">

        <div>
            <ArrowLeft className='text-custom-lightGreen'/>
        </div>

        <div>
            {avatar}
        </div>
    </div>
  )
}

export default TopNavigation