/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import React, { useState } from 'react';
import { useVoteDetails } from '@/utils/hooks/useMusicVotes';
import { useVoteCounts } from '@/utils/hooks/useMusicVotes';
import { useEnsName } from '@/utils/hooks/useEnsName';
import { EAS_CONFIG } from "@/config/site";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from 'lucide-react';
import { showCopySuccessAlert } from '@/utils/alertUtils';
import { ethers } from 'ethers';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import MusicGrid from '@/components/ui/music/MusicGrid';
import { Skeleton } from "@/components/ui/skeleton";

export default function AddressPage({ params }: { params: { slug: string } }) {
  const { slug: rawAddress } = params;
  const address = ethers.getAddress(rawAddress);
  const graphqlEndpoint = EAS_CONFIG.GRAPHQL_URL;

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

  const avatar = ProfileAvatar(address)

  // Add this loading check
  const isLoading = isCountsLoading || isVotesLoading || ensLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen text-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col">
          <div className="flex flex-col gap-8">
            <div className="w-full">
              <Card className="md:sticky md:top-4">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-8 w-48 mt-2" />
                    <Skeleton className="h-4 w-32 mt-1" />
                  </div>
                  <div className="mt-4 mb-4 text-center">
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col">
        <div className="flex flex-col gap-8">
          <div className="w-full">
            <Card className="md:sticky md:top-4">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-4">
                  {avatar}
                  <h1 className="text-2xl font-bold mt-4">
                    {ensName || truncateAddress(address)}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>{truncateAddress(address)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={copyAddress}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 mb-4 text-center">
                  <p className="text-gray-600">
                    {votesRemaining} votes remaining
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-custom-lightGreen border-b-2 border-custom-lightGreen pb-2 flex items-center gap-2">
            <span className="bg-custom-darkGreen px-3 rounded-lg">Voted Songs</span>
            <span className="text-sm font-normal text-gray-400">
              ({musicData.length} songs)
            </span>
          </h2>

          {musicData.length === 0 && !isLoading ? (
            <div className="text-center text-gray-500 py-8">
              <p>No voted songs found</p>
            </div>
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
