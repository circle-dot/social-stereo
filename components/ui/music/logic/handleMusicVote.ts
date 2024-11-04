import { handleVouch } from "@/utils/handleAttestation";
import { EAS_CONFIG } from "@/config/site";
import { User, ConnectedWallet } from "@privy-io/react-auth";
import { spotifyIdToEthAddress } from "./convertToAddress";
import communities from '@/data/communities.json';

export const handleMusicVote = async (
    trackId: string,
    user: User,
    wallets: ConnectedWallet[],
    getAccessToken: () => Promise<string | null>,
    org: string
): Promise<{ error?: string }> => {
    try {
        console.log('Voted for track with ID:', trackId);
        const recipient = spotifyIdToEthAddress(trackId);
        console.log('Recipient:', recipient);

        // Find community config case-insensitively
        const communityKey = Object.keys(communities).find(
            key => key.toLowerCase() === org.toLowerCase()
        );

        if (!communityKey) {
            throw new Error(`Community ${org} not found in configuration`);
        }

        const communityConfig = communities[communityKey as keyof typeof communities];
        const result = await handleVouch(
            recipient, 
            user, 
            wallets, 
            getAccessToken, 
            EAS_CONFIG.VOUCH_SCHEMA, 
            EAS_CONFIG.chainId, 
            communityConfig.platform, 
            EAS_CONFIG.EAS_CONTRACT_ADDRESS, 
            communityConfig.category, 
            communityConfig.subcategory
        );
        
        if (result?.error === 'NO_VALID_WALLETS') {
            return { error: 'NO_VALID_WALLETS' };
        }
        return {};
    } catch (error) {
        console.error("Error in handleMusicVote:", error);
        throw error;
    }
};