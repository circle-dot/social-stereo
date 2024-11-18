"use client"
import { ArrowUp } from 'lucide-react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogOverlay } from '@/components/ui/dialog'
import Link from 'next/link'
import Swal from 'sweetalert2'

interface VoteSongButtonProps {
    trackId: string;
    params: {
        org: string;
    };
}

export default function VoteSongButton({ trackId, params }: VoteSongButtonProps) {
    console.log(trackId)
    const { ready } = usePrivy();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {ready: walletsReady } = useWallets();
    const handleVote = async () => {
      Swal.fire({
        title: 'Vote season ended',
        text: 'Thanks for participating during Devcon SEA 7, the votes are already closed.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      })
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
                            <Link
                                href={`/${params.org}/login`}
                                onClick={() => setIsDialogOpen(false)}
                                className="w-full bg-custom-lightGreen text-custom-black hover:bg-custom-lightGreen/90 py-3 flex items-center justify-center rounded-md"
                            >
                                Log In
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