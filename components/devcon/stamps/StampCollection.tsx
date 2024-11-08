import { cn } from "@/lib/utils"
import Image from "next/image"

interface Stamp {
  id: string
  title: string
  icon: string
  isLocked?: boolean
}

interface StampCollectionProps {
  stamps: Stamp[]
  title?: string
}

export default function StampCollection({ 
  stamps, 
  title = "My Stamps" 
}: StampCollectionProps = {
  stamps: [
    { id: '1', title: 'Devcon Resident', icon: '/StampIt.png' },
    { id: '2', title: 'First Upvote', icon: '/StampIt.png', isLocked: true },
    { id: '3', title: 'Early Adopter', icon: '/StampIt.png', isLocked: true },
    { id: '4', title: 'Top Contributor', icon: '/StampIt.png', isLocked: true },
  ]
}) {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
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