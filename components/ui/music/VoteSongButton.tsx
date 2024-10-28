"use client"
import { ArrowUp } from 'lucide-react'
import { handleMusicVote } from './logic/handleMusicVote'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogOverlay } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function VoteSongButton({ trackId }: { trackId: string }) {
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
            return;
        }
        try {
            const result = await handleMusicVote(trackId, user, wallets, getAccessToken);
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
                    <DialogFooter className="mt-6 flex flex-col !items-end space-y-2 w-full">
                        <Button 
                            onClick={() => { login(); setIsDialogOpen(false); }} 
                            className="w-full bg-custom-lightGreen text-custom-black hover:bg-custom-lightGreen/90 px-6 py-3"
                        >
                            Log In
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={() => setIsDialogOpen(false)} 
                            className="w-full bg-custom-darkGreen text-white hover:bg-custom-darkGreen/90 px-6 py-3"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>  
            <button onClick={handleVote} className="bg-custom-lightGreen text-custom-black p-2 rounded-full w-10 h-10 flex items-center justify-center">
      <ArrowUp className="w-5 h-5" />
    </button>
        </>

    )
}
