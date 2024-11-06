import { NextResponse } from 'next/server';
import { EAS_CONFIG } from '@/config/site';
import communities from '@/data/communities.json';
import prisma from '@/lib/db';
import { ethers } from 'ethers';
import privy from '@/lib/privy';

// Helper function to decode bytes32 to string
function decodeBytes32(bytes32: string): string {
  try {
    // Remove trailing zeros and convert to string
    return ethers.decodeBytes32String(bytes32.replace(/0+$/, ''));
  } catch {
    // If decoding fails, return the original value
    return bytes32;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet, community } = body;

    if (!wallet || !community) {
      return NextResponse.json({ error: 'Wallet and community are required' }, { status: 400 });
    }

    // Add validation for wallet address format
    if (!ethers.isAddress(wallet)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    // Get community filters
    const communityData = communities[community as keyof typeof communities];
    if (!communityData) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    // Verify Privy token
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verifiedClaims = await privy.verifyAuthToken(authorization);

    // Standardize wallet address format early in the function
    const normalizedWallet = ethers.getAddress(wallet).toLowerCase();

    // Check if user exists and create if not
    let dbUser = await prisma.user.findUnique({
      where: {
        id: verifiedClaims.userId
      }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: verifiedClaims.userId,
          wallet: normalizedWallet
        }
      });
    }

    // First check if we already have this attestation in our DB
    const existingZupass = await prisma.zupass.findFirst({
      where: {
        wallet: normalizedWallet
      }
    });

    if (existingZupass) {
      return NextResponse.json({ 
        decodedDataJson: existingZupass 
      });
    }

    // Construct GraphQL query
    const query = `
      query Attestations($where: AttestationWhereInput) {
        attestations(where: $where) {
          id
          attester
          timeCreated
          recipient
          decodedDataJson
        }
      }
    `;

    const variables = {
      where: {
        schemaId: {
          equals: EAS_CONFIG.PRETRUST_SCHEMA
        },
        revoked: {
          equals: false
        },
        recipient: {
          equals: wallet
        },
        AND: [
          {
            decodedDataJson: {
              contains: communityData.FirstFilter
            }
          },
          {
            decodedDataJson: {
              contains: communityData.SecondFilter
            }
          },
          {
            decodedDataJson: {
              contains: communityData.ThirdFilter
            }
          }
        ]
      }
    };

    // Make GraphQL request
    const response = await fetch(EAS_CONFIG.GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const data = await response.json();
    
    if (data.data?.attestations?.length > 0) {
      const attestation = data.data.attestations[0];
      const rawDecodedData = JSON.parse(attestation.decodedDataJson);
      const decodedDataArray = JSON.parse(rawDecodedData.decodedDataJson);

      // Helper function to find and decode a specific field
      const getDecodedField = (fieldName: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const field = decodedDataArray.find((item: any) => item.name === fieldName);
        if (field?.value?.value) {
          return decodeBytes32(field.value.value);
        }
        return '';
      };

      // Create new Zupass entry with decoded values
      const newZupass = await prisma.zupass.create({
        data: {
          wallet: attestation.recipient.toLowerCase(),
          nullifier: getDecodedField('nullifier'),
          attestationUID: attestation.id,
          category: getDecodedField('category'),
          subcategory: getDecodedField('subcategory'),
          credentialType: getDecodedField('credentialType'),
          platform: getDecodedField('platform'),
        }
      });

      return NextResponse.json({ 
        decodedDataJson: newZupass 
      });
    }

    return NextResponse.json({ decodedDataJson: null });

  } catch (error) {
    console.error('Error checking pretrust:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}