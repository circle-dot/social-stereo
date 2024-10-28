import { handleVouch } from "@/utils/handleAttestation";
import { EAS_CONFIG } from "@/config/site";
import { User, ConnectedWallet } from "@privy-io/react-auth";
import { spotifyIdToEthAddress } from "./convertToAddress";

export const handleMusicVote = async (
    trackId: string,
    user: User,
    wallets: ConnectedWallet[],
    getAccessToken: () => Promise<string | null>
): Promise<void> => {
    console.log('Voted for track with ID:', trackId);
    const recipient = spotifyIdToEthAddress(trackId);
    console.log('Recipient:', recipient);
    const subcategory = "Music";
    await handleVouch(
        recipient, 
        user, 
        wallets, 
        getAccessToken, 
        EAS_CONFIG.VOUCH_SCHEMA, 
        EAS_CONFIG.chainId, 
        EAS_CONFIG.platform, 
        EAS_CONFIG.EAS_CONTRACT_ADDRESS, 
        EAS_CONFIG.category, 
        subcategory
    );
};
