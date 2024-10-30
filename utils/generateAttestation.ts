async function generateAttestation(token: string, platform: string, recipient: string, attester: string, signature: string, category: string, subcategory: string) {
    const url = process.env.NEXT_PUBLIC_STAMP_API_URL + '/attestation';


    const body = JSON.stringify({
        platform,
        recipient,
        attester,
        signature,
        category,
        subcategory
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
            'x-privy-app-id': 'stamp',
        },
        body: body
    });

    if (!response.ok) {
        // Get error response as JSON if possible
        const errorData = await response.json().catch(() => null);
        
        if (response.status === 550) {
            throw new Error("You have no vouches available.");
        } else if (response.status === 400) {
            // Use the error message from response if available, otherwise use default message
            throw new Error(errorData?.message || "You can't vouch yourself.");
        } else {
            // Throw a general error for other status codes
            throw new Error(`Error creating attestation: ${response.statusText}`);
        }
    }


    return await response.json();
}

export default generateAttestation;
