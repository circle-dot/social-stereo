/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"
import { RefreshCcw } from 'lucide-react';
import { usePrivy } from "@privy-io/react-auth";

interface StampResponse {
  currentStamps: string[]
  missingStamps: Record<string, any>
  earnedStamps: Record<string, string>
}

interface Stamp {
  id: string
  title: string
  icon: string
  isLocked?: boolean
  canClaim?: boolean
}

const StampCollection = () => {
  const title = "My Stamps";
  const { user, ready, authenticated } = usePrivy();
  const stampsHistory = [
    {
      id: '1',
      title: 'Love at First Sight',
      description: 'You proposed a song.',
      imageurl: 'https://stereo.stamp.network/stamps/loveatfirstsight.png'
    },
    {
      id: '2',
      title: 'Getting there',
      description: 'You vouched for 5 songs',
      imageurl: 'https://stereo.stamp.network/stamps/gettingthere.png'
    },
    {
      id: '3',
      title: 'Livin on a prayer',
      description: 'You vouched for 10 songs.',
      imageurl: 'https://stereo.stamp.network/stamps/livinonaprayer.png'
    },
    {
      id: '4',
      title: 'All In',
      description: 'You used ALL your vouches.',
      imageurl: 'https://stereo.stamp.network/stamps/allin.png'
    },
    {
      id: '5',
      title: 'Midnight DJ',
      description: 'You proposed or voted on songs during the "dead hours" and kept the playlist alive.',
      imageurl: 'https://stereo.stamp.network/stamps/midnightdj.png'
    },
    {
      id: '6',
      title: 'Music Prophet',
      description: 'You voted for three songs that ended up in the top 10. You\'ve got the magic touch!',
      imageurl: 'https://stereo.stamp.network/stamps/musicprophet.png'
    },
    {
      id: '7',
      title: 'Passionate Proposer',
      description: 'You\'ve proposed 10+ songs that have entered the top 100. You bring the hits!',
      imageurl: 'https://stereo.stamp.network/stamps/passionateproposer.png'
    },
    {
      id: '8',
      title: 'Lone Listener',
      description: 'You voted for a song that no one else dared to. We see you.',
      imageurl: 'https://stereo.stamp.network/stamps/lonelistener.png'
    },
    {
      id: '9',
      title: 'Party Catalyst',
      description: 'Your song was the first to reach 10 votes.',
      imageurl: 'https://stereo.stamp.network/stamps/partycatalyst.png'
    },
    {
      id: '10',
      title: 'Genre Guru',
      description: 'You\'ve voted for 10+ songs of the same genre. You\'re kind of an expert, aren\'t you?',
      imageurl: 'https://stereo.stamp.network/stamps/genreguru.png'
    },
    {
      id: '11',
      title: 'Diamond Curator',
      description: 'A song you voted ended up in the top 10.',
      imageurl: 'https://stereo.stamp.network/stamps/diamondcurator.png'
    },
    {
      id: '12',
      title: 'Gold Curator',
      description: 'A song you voted ended up in the top 50.',
      imageurl: 'https://stereo.stamp.network/stamps/goldcurator.png'
    },
    {
      id: '13',
      title: 'Silver Curator',
      description: 'A song you voted ended up in the top 100.',
      imageurl: 'https://stereo.stamp.network/stamps/silvercurator.png'
    },
    {
      id: '14',
      title: 'DevCon Sea Atendee',
      description: 'You attended the DevCon SEA event.',
      imageurl: 'https://stereo.stamp.network/stamps/attendee.png'
    },
  ];

  // Initialize with locked stamps immediately
  const [stamps, setStamps] = useState<Stamp[]>(() => 
    stampsHistory.map(stamp => ({
      id: stamp.id,
      title: stamp.title,
      icon: stamp.imageurl,
      isLocked: true
    }))
  );
  
  // Set initial loading state to true if we need to authenticate
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address) {
      getStamps()
    } else if (ready && !authenticated) {
      // Keep stamps locked but stop loading
      setIsLoading(false)
    }
  }, [ready, authenticated, user?.wallet?.address])

  const getStamps = async () => {
    try {
      setIsLoading(true)
      // Grey out all stamps while loading
      setStamps(stamps.map(stamp => ({ ...stamp, isLocked: true })))

      const response = await fetch(`/api/stamps?wallet=${user?.wallet?.address}&org=devcon`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch stamps')
      }
      const data: StampResponse = await response.json()
      
      // Transform stamps data based on response
      const processedStamps = stampsHistory.map(stamp => {
        // Always unlock DevCon Sea Attendee stamp (id: '14')
        // For other stamps, check if they exist in earnedStamps
        const isEarned = stamp.id === '14' || `Stamp${stamp.id}` in data.earnedStamps
        
        return {
          id: stamp.id,
          title: stamp.title,
          icon: stamp.imageurl,
          isLocked: !isEarned,
          canClaim: false
        }
      })
      
      // Sort stamps: earned first, then locked
      const sortedStamps = processedStamps.sort((a, b) => {
        if (!a.isLocked && b.isLocked) return -1
        if (a.isLocked && !b.isLocked) return 1
        return 0
      })
      
      setStamps(sortedStamps)
    } catch (error) {
      console.error('Error refreshing stamps:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button
          onClick={() => getStamps()}
          className={cn(
            "p-2 rounded-full transition-colors",
            isLoading 
              ? "opacity-50 cursor-not-allowed bg-white/10" 
              : "text-white/60 hover:text-custom-lightGreen hover:bg-white/10"
          )}
          disabled={isLoading}
          aria-label="Refresh stamps"
        >
          <RefreshCcw 
            className={cn("w-5 h-5", isLoading && "animate-spin")} 
            stroke="#B9FE5E" 
            strokeWidth={3}
          />
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
                "transition-all duration-200",
                (stamp.isLocked || isLoading) && "opacity-50",
                !stamp.isLocked && !isLoading && "hover:border-custom-lightGreen/50"
              )}
            >
              {stamp.canClaim && (
                <button
                  className="mb-2 px-3 py-1 text-sm bg-custom-lightGreen text-custom-darkPurple rounded-full hover:bg-custom-lightGreen/90 transition-colors"
                  onClick={() => {/* Add claim handling here */}}
                >
                  Claim
                </button>
              )}
              <div className="relative min-w-[96px] min-h-[96px] mb-3">
                <Image
                  src={`/stamps/${stamp.icon.split('/').pop()}`}
                  alt={stamp.title}
                  fill
                  className="rounded-full"
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