/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { useVoteDetails } from '@/utils/hooks/useMusicVotes';
import { useVoteCounts } from '@/utils/hooks/useMusicVotes';
import { useEnsName } from '@/utils/hooks/useEnsName';
import { EAS_CONFIG } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Copy, Info } from 'lucide-react';
import { showCopySuccessAlert } from '@/utils/alertUtils';
import { ethers } from 'ethers';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import MusicGrid from '@/components/ui/music/MusicGrid';
import { Skeleton } from "@/components/ui/skeleton";
import { usePrivy } from '@privy-io/react-auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export default function AddressPage({ params }: { params: { slug: string } }) {
  const { slug: rawAddress } = params;
  const address = ethers.getAddress(rawAddress);
  const graphqlEndpoint = EAS_CONFIG.GRAPHQL_URL;
  const { user, ready, authenticated } = usePrivy();
  const { vouchesMade, isLoading: isCountsLoading } = useVoteCounts(graphqlEndpoint, address);
  const { attestations, isLoading: isVotesLoading } = useVoteDetails(graphqlEndpoint, address);

  // Extract unique recipients from attestations
  const recipients = attestations ? Array.from(new Set(attestations.map((att: { recipient: string; }) => att.recipient as string))) : [];
  console.log('recipients', recipients)
  const { data: ensName, isLoading: ensLoading } = useEnsName(address);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    showCopySuccessAlert();
  };

  const [musicData, setMusicData] = useState<any[]>([]);

  const fetchMusicData = async () => {
    if (recipients.length > 0) {
      try {
        const response = await fetch('/api/musicRanking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipients }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch music data');
        }

        const { music } = await response.json();
        setMusicData(music);
      } catch (error) {
        console.error('Error fetching music data:', error);
      }
    }
  };

  // Call it once when attestations are loaded
  if (!isVotesLoading && attestations && musicData.length === 0) {
    fetchMusicData();
  }

  const totalVotesMade = vouchesMade?.data?.aggregateAttestation?._count?.attester ?? 0;
  const maxVotes = 20;
  const votesRemaining = Math.max(0, maxVotes - totalVotesMade);


  // Add this loading check
  const isLoading = isCountsLoading || isVotesLoading || ensLoading;

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  if (isLoading) {
    return (
      <div className=" p-6">
        <div className="flex flex-col items-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48 mt-4" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-custom-purple p-6">
        <div className="flex flex-col items-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48 mt-4" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className=" p-6">
      {/* Profile Header */}
      <div className="mb-8">
        <p className="text-white/80 text-sm mb-1">Profile Details</p>
        <div className="flex flex-col gap-1">
          <h1 className="text-[#B4FF4C] text-2xl font-bold">
            {ensName || truncateAddress(address)}
          </h1>
       
        </div>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24  rounded-full">
          {ProfileAvatar(address, "w-full h-full hover:cursor-default")}
        </div>
      </div>
      <TooltipProvider>
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
              <TooltipTrigger asChild>
                <div 
                  className="flex items-center justify-center gap-2 text-white/60 text-sm cursor-pointer"
                >
                  <span className="font-mono">
                    {truncateAddress(address)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyAddress();
                    }}
                    className="text-[#B4FF4C] hover:text-[#B4FF4C]/80 h-6 w-6"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-white h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTooltipOpen(!isTooltipOpen);
                    }}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                onPointerDownOutside={() => setIsTooltipOpen(false)}
                className="select-all"
              >
                <p className="font-mono text-sm">{address}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

      <div className="my-6">
        {ready && authenticated && user?.wallet?.address ? (
          ethers.getAddress(user.wallet.address) === ethers.getAddress(address) ? (
            <button className="w-full bg-[#B4FF4C] text-black rounded-2xl p-4 font-semibold">
              Your Profile
            </button>
          ) : (
            <button className="w-full bg-[#B4FF4C] text-black rounded-2xl p-4 font-semibold">
              Endorse for Karaoke
            </button>
          )
        ) : (
          <button className="w-full bg-[#B4FF4C] text-black rounded-2xl p-4 font-semibold">
            Endorse for Karaoke
          </button>
        )}
      </div>
      {/* Votes Counter */}
      <div className="mb-6">
        <label className="text-white/80 text-sm block mb-2">Votes Remaining</label>
        <div className="w-full bg-white/10 rounded-2xl p-4 text-[#B4FF4C]">
          {votesRemaining} / {maxVotes}
        </div>
      </div>

      {/* Music Grid Section */}
      <div className="mb-6">
        <label className="text-white/80 text-sm block mb-2">Voted Songs</label>
        <div className="bg-white/10 rounded-2xl p-4">
          {musicData.length === 0 ? (
            <p className="text-white/60 text-center py-4">No voted songs found</p>
          ) : (
            <MusicGrid
              tracks={musicData}
              isLoading={isVotesLoading}
            />
          )}
        </div>
      </div>

  
    </div>
  );
}