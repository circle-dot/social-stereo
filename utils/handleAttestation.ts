import generateAttestation from '@/utils/generateAttestation';
import { showLoadingAlert, showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import fetchNonce from './fetchNonce';
import { signTypedData } from './signTypedData';
import { EAS_CONFIG } from '@/config/site';

const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

export const handleVouch = async (
    recipient: string,
    user: any,
    wallets: any,
    getAccessToken: any,
    schema: string,
    chain: number | string,
    platform: string,
    verifyingContract: string,
    category: string,
    subcategory: string,
    retryCount = 0
): Promise<{ error?: string } | void> => {
    if (!user?.wallet?.address) {
        showErrorAlert('User wallet address is not defined.');
        return;
    }

    if (recipient === user.wallet.address) {
        showErrorAlert("You can't vouch yourself.");
        return;
    }
    showLoadingAlert('Processing...', 'Please wait while your request is being processed.');

    const token = await getAccessToken();
    if (!token) {
        showErrorAlert('Something went wrong. Try reloading the page.');
        return;
    }

    const nonce = await fetchNonce(user.wallet.address, token);

    if (nonce === undefined) {
        showErrorAlert('Failed to fetch nonce.');
        return;
    }

    try {
        const chainId = typeof chain === 'string' ? parseInt(chain) : chain;
        const schemaUID = schema;
        const attester = user?.wallet.address;
        const schemaEncoder = new SchemaEncoder("bytes32 platform,bytes32 category,bytes32 subCategory");
        console.log("platform:", platform);
        console.log("category:", category);
        console.log("subcategory:", subcategory);
        const encodedData = schemaEncoder.encodeData([
            { name: "platform", value: ethers.encodeBytes32String(platform), type: "bytes32" },
            { name: "category", value: ethers.encodeBytes32String(category), type: "bytes32" },
            { name: "subCategory", value: ethers.encodeBytes32String(subcategory), type: "bytes32" },
        ]);
        const domain = {
            name: 'EAS',
            version: '1.0.1',
            chainId: chainId,
            verifyingContract: verifyingContract
        };

        const types = {
            Attest: [
                { name: 'schema', type: 'bytes32' },
                { name: 'recipient', type: 'address' },
                { name: 'expirationTime', type: 'uint64' },
                { name: 'revocable', type: 'bool' },
                { name: 'refUID', type: 'bytes32' },
                { name: 'data', type: 'bytes' },
                { name: 'nonce', type: 'uint256' },
            ]
        };

        const value = {
            attester: attester,
            schema: schemaUID,
            recipient: recipient,
            expirationTime: BigInt(0),
            revocable: true,
            refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
            data: encodedData,
            nonce: BigInt(nonce),
        };

        const typedData = {
            domain: domain,
            primaryType: 'Attest',
            message: value,
            types: types,
        };
        console.log('typedData:', typedData);
        console.log('wallets', wallets);
        if (!wallets || !Array.isArray(wallets) || wallets.length === 0) {
            showErrorAlert('No valid wallets found. Please log in again.');
            return { error: 'NO_VALID_WALLETS' };
        }
        const signature = await signTypedData(user, wallets, chainId, typedData);


        //TO CONSIDER, we can pass encoded data instead of doing it server side as well, but should we?
        const resultAttestation = await generateAttestation(token, platform, recipient, attester, signature, category, subcategory);
        console.log('resultAttestation:', resultAttestation);

        // Construct the attestation view URL
        const baseUrl = EAS_CONFIG.GRAPHQL_URL.replace('/graphql', '');
        const attestationViewUrl = `${baseUrl}/attestation/view/${resultAttestation.newAttestationUID}`;

        showSuccessAlert('Vouch created successfully.', 'Go to vouch', attestationViewUrl);

    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';

        // Check for maximum vouches error
        if (error.message?.includes('Maximum number of vouches reached')) {
            showErrorAlert('You have reached the maximum number of allowed vouches.');
            return;
        }

        if (errorMessage === '550') {
            showErrorAlert("You don't have any vouches available.");
        } else if (errorMessage === "You can't vouch yourself.") {
            showErrorAlert("You can't vouch yourself.");
        } else if (errorMessage.includes("You have already vouched for this user in this season")) {
            showErrorAlert("You have already vouched for this in this season.");
        } else {
            if (retryCount < MAX_RETRIES) {
                console.log(`Retry attempt ${retryCount} of ${MAX_RETRIES}`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return handleVouch(
                    recipient,
                    user,
                    wallets,
                    getAccessToken,
                    schema,
                    chain,
                    platform,
                    verifyingContract,
                    category,
                    subcategory,
                    retryCount + 1
                );
            } else {
                showErrorAlert(`An error occurred while creating the vouch after ${MAX_RETRIES + 1} attempts.`);
            }
        }
    }
};