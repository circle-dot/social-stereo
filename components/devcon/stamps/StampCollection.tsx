'use client';

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"

interface Stamp {
  id: string
  title: string
  icon: string
  isLocked?: boolean
}

const StampCollection = () => {
  const title = "My Stamps"
  const initialStamps = [
    { id: '1', title: 'Devcon Resident', icon: '/StampIt.png' },
    { id: '2', title: 'First Upvote', icon: '/StampIt.png', isLocked: true },
    { id: '3', title: 'Early Adopter', icon: '/StampIt.png', isLocked: true },
    { id: '4', title: 'Top Contributor', icon: '/StampIt.png', isLocked: true },
  ]

  const [stamps, setStamps] = useState<Stamp[]>(initialStamps)
  const [isLoading, setIsLoading] = useState(false)

  const getStamps = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/getStamps', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch stamps')
      }
      const data = await response.json()
      setStamps(data)
    } catch (error) {
      console.error('Error refreshing stamps:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getStamps()
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto my-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button
          onClick={() => getStamps()}
          className="p-2 text-white/60 hover:text-custom-lightGreen transition-colors rounded-full hover:bg-white/10"
          disabled={isLoading}
        >
          <svg className={cn("animate-spin", !isLoading && "animate-none")} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B9FE5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4 min-w-max">
          {stamps.map((stamp) => (
            <div
              key={stamp.id}
              className={cn(
                "flex flex-col items-center p-4 rounded-xl w-[160px]",
                "bg-custom-darkPurple border border-custom-lightGreen",
                "transition-all duration-200 hover:border-custom-lightGreen/50",
                stamp.isLocked && "opacity-50"
              )}
            >
              <div className="relative min-w-[96px] min-h-[96px] mb-3">
                <Image
                  src={stamp.icon}
                  alt={stamp.title}
                  fill
                  className=" rounded-full"
                  priority
                />
              </div>
              <span className={cn(
                "text-center",
                stamp.isLocked ? "text-white/50" : "text-white"
              )}>
                {stamp.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StampCollection;