"use client"
import React from 'react'
import { ArrowLeft } from 'lucide-react'

function TopNavigation() {
  return (
    <div className="w-full flex justify-between items-center p-4">

        <div>
            <ArrowLeft className='text-custom-lightGreen'/>
        </div>

    </div>
  )
}

export default TopNavigation