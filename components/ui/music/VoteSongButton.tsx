"use client"
import { ArrowUp } from 'lucide-react'
import { handleMusicVote } from './logic/handleMusicVote'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogOverlay } from '@/components/ui/dialog'
import { showLoadingAlert } from '@/utils/alertUtils';
import { Button } from '@/components/ui/button'
import { showZupassWarningAlert } from '@/utils/alertUtils';
import Link from 'next/link'
import { ethers } from 'ethers'

interface VoteSongButtonProps {
    trackId: string;
    params: {
        org: string;
    };
}

export default function VoteSongButton({ trackId, params }: VoteSongButtonProps) {
    const { login, authenticated, ready, getAccessToken, user, logout } = usePrivy();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { wallets, ready: walletsReady } = useWallets();
    const handleVote = async () => {
        console.log(trackId);
        if (!authenticated && ready) {
            setIsDialogOpen(true);
            return;
        }
        if (!user || !ready || !walletsReady) {
            console.error("User not ready or wallets not initialized");
            await logout();
            return;
        }

        showLoadingAlert('Checking verification...', 'Please wait while we verify your credentials');

        // Check if user has Zupass verification
        try {
            const token = await getAccessToken();
            const normalizedAddress = ethers.getAddress(user?.wallet?.address || '')
            const response = await fetch(`/api/user/${normalizedAddress}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Show toast to redirect to login for Zupass verification
                showZupassWarningAlert(params);
                return;
            }

            // If Zupass verified, proceed with vote
            const result = await handleMusicVote(trackId, user, wallets, getAccessToken, params.org);
            if (result?.error === 'NO_VALID_WALLETS') {
                await logout();
            }
        } catch (error) {
            console.error("Error voting for track:", error);
        }
    }

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogOverlay className="fixed inset-0 bg-black/50 z-[100]" />
                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110] bg-custom-purple p-6 rounded-lg shadow-xl w-[90%] max-w-[400px]" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogTitle className="text-xl font-semibold text-custom-lightGreen">Login Required</DialogTitle>
                    <DialogDescription className="text-white mt-2">
                        You need to be logged in to vote for a track.
                    </DialogDescription>
                    <DialogFooter className="mt-6 flex !flex-col space-y-2 !items-end w-full">
                        <div className="flex flex-col space-y-2 w-full">
                            <Button
                                onClick={() => {
                                    login({
                                        disableSignup: true,
                                    })
                                    setIsDialogOpen(false);
                                }}
                                className="w-full bg-custom-lightGreen text-custom-black hover:bg-custom-lightGreen/90 py-3"
                            >
                                Log In
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setIsDialogOpen(false)}
                                className="w-full bg-custom-darkGreen text-white hover:bg-custom-darkGreen/90 py-3"
                            >
                                Cancel
                            </Button>
                        </div>
                        <div className="w-full text-center text-sm text-white mt-2">
                            Dont have an account?{' '}
                            <Link href={`/${params.org}/login`} className="text-custom-lightGreen hover:underline" onClick={() => setIsDialogOpen(false)}>
                                Register here
                            </Link>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <button
                onClick={handleVote}
                disabled={!ready || !walletsReady}
                className={`bg-custom-lightGreen text-custom-black p-2 rounded-full w-10 h-10 flex items-center justify-center ${(!ready || !walletsReady) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </>

    )
}