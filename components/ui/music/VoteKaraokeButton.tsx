"use client"
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogOverlay } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Swal from 'sweetalert2'
import { handleVouch } from '@/utils/handleAttestation'
import { EAS_CONFIG } from '@/config/site'
export default function VoteKaraokeButton({ walletAddress }: { walletAddress: string }) {
    const { login, authenticated, ready, getAccessToken, user, logout } = usePrivy();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { wallets, ready: walletsReady } = useWallets();

    const handleVote = async () => {
        console.log(walletAddress);
        if (!authenticated && ready) {
            setIsDialogOpen(true);
            return;
        }
        if (!user || !ready || !walletsReady) {
            console.error("User not ready or wallets not initialized");
            await logout();
            return;
        }
       
        // Show loading state
        Swal.fire({
            title: 'Checking verification...',
            text: 'Please wait while we verify your credentials',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });

        // Check if user has Zupass verification
        try {
            const token = await getAccessToken();
            const response = await fetch(`/api/user/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Close loading state
            await Swal.close();
            
            if (!response.ok) {
                // Show dialog to redirect to login for Zupass verification
                await Swal.fire({
                    icon: 'warning',
                    title: 'Zupass Required',
                    text: 'You need to verify your Zupass before voting. Would you like to do that now?',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, verify Zupass',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/login';
                    }
                });
                return;
            }

            // If Zupass verified, proceed with vote
            const schema = EAS_CONFIG.VOUCH_SCHEMA;
            const chain = EAS_CONFIG.chainId;
            const platform = EAS_CONFIG.platform;
            const verifyingContract = EAS_CONFIG.EAS_CONTRACT_ADDRESS;
            const category = EAS_CONFIG.category;
            const subcategory = "CutTheLine";
            const result = await handleVouch(walletAddress, user, wallets, getAccessToken, schema, chain, platform,verifyingContract, category, subcategory);
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
            <button 
                onClick={handleVote} 
                disabled={!ready || !walletsReady}
                className={`w-full bg-[#B4FF4C] text-black rounded-2xl p-4 font-semibold${
                    (!ready || !walletsReady) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                Endorse for Karaoke
            </button>
        </>

    )
}