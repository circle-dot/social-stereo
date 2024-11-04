import prisma from '@/lib/db';
import { ethers } from 'ethers';
import { EAS_CONFIG } from '@/config/site';
import communities from '@/data/communities.json';

export async function verifyOrCreateZupassEntry(params: {
  wallet: string,
  community: string
}) {
  const { wallet, community } = params;
  const normalizedWallet = ethers.getAddress(wallet);

  // First check if we already have an entry for this wallet
  const existingEntry = await prisma.zupass.findFirst({
    where: {
      wallet: normalizedWallet.toLowerCase()
    }
  });

  if (existingEntry) {
    return existingEntry;
  }

  // If no existing entry, query EAS for attestation
  const query = `
    query Attestations($where: AttestationWhereInput) {
      attestations(where: $where) {
        id
        recipient
        decodedDataJson
      }
    }
  `;

  // Get community filters from communities.json
  const communityConfig = communities[community as keyof typeof communities];
  if (!communityConfig) {
    throw new Error(`Community ${community} not found in configuration`);
  }

  const variables = {
    where: {
      schemaId: {
        equals: EAS_CONFIG.PRETRUST_SCHEMA
      },
      revoked: {
        equals: false
      },
      recipient: {
        equals: normalizedWallet
      },
      AND: [
        { decodedDataJson: { contains: communityConfig.FirstFilter } },
        { decodedDataJson: { contains: communityConfig.SecondFilter } },
        { decodedDataJson: { contains: communityConfig.ThirdFilter } }
      ]
    }
  };

  const response = await fetch(EAS_CONFIG.GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });

  const data = await response.json();
  
  if (data.data?.attestations?.length > 0) {
    const attestation = data.data.attestations[0];
    
    // Parse the decodedDataJson string once
    const decodedDataArray = JSON.parse(attestation.decodedDataJson);

    // Create new entry
    const newEntry = await prisma.zupass.create({
      data: {
        wallet: normalizedWallet.toLowerCase(),
        nullifier: getDecodedField(decodedDataArray, 'nullifier'),
        attestationUID: attestation.id,
        category: getDecodedField(decodedDataArray, 'category'),
        subcategory: getDecodedField(decodedDataArray, 'subcategory'),
        credentialType: getDecodedField(decodedDataArray, 'credentialType'),
        platform: getDecodedField(decodedDataArray, 'platform'),
      }
    });

    return newEntry;
  }

  return null;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDecodedField(decodedDataArray: any[], fieldName: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const field = decodedDataArray.find((item: any) => item.name === fieldName);
  if (field?.value?.value) {
    try {
      return ethers.decodeBytes32String(field.value.value.replace(/0+$/, ''));
    } catch {
      return field.value.value;
    }
  }
  return '';
}