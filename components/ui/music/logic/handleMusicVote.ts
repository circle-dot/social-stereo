import { handleVouch } from "@/utils/handleAttestation";
import { EAS_CONFIG } from "@/config/site";
import { stringToBytes20 } from "./convertToAddress";
import { User, ConnectedWallet } from "@privy-io/react-auth";
export const handleMusicVote = (
    trackId: string,
    isAuthenticated: boolean,
    user: User,
    wallets: ConnectedWallet[],
    getAccessToken: () => Promise<string | null>
) => {
    if (!isAuthenticated) {
        console.log('Attempted to vote while not authenticated');
        return;
    }
    console.log('Voted for track with ID:', trackId);
    const recipient = stringToBytes20(trackId);
    const subcategory = "Music";
    handleVouch(recipient, user, wallets, getAccessToken, EAS_CONFIG.VOUCH_SCHEMA, EAS_CONFIG.chainId, EAS_CONFIG.platform, EAS_CONFIG.EAS_CONTRACT_ADDRESS, EAS_CONFIG.category, subcategory);
};
