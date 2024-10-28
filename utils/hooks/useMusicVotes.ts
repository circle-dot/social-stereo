import { useQuery } from '@tanstack/react-query';
import ATTESTATION_DETAILS from '../../graphql/queries/UserProfile/AttestationDetails';
import COUNT_ATTESTATIONS_MADE from '@/graphql/queries/AttestationsMadeCount';
import { EAS_CONFIG } from '@/config/site';
export const useVoteCounts = (graphqlEndpoint: string, formattedAddress: string | undefined) => {

  const { data: vouchesMade, isLoading: isVouchesMadeLoading } = useQuery({
    queryKey: ['vouchesMade', formattedAddress],
    queryFn: async () => {
      if (!formattedAddress) return null;
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: COUNT_ATTESTATIONS_MADE,
          variables: { 
            where: {
              attester: { equals: formattedAddress },
              schemaId: { equals: EAS_CONFIG.VOUCH_SCHEMA },
              AND: [
                {
                  decodedDataJson: {
                    contains: "0x446576636f6e0000000000000000000000000000000000000000000000000000"
                  }
                },
                {
                  decodedDataJson: {
                    contains: "0x536f6369616c53746572656f0000000000000000000000000000000000000000"
                  }
                },
                {
                  decodedDataJson: {
                    contains: "0x4d75736963000000000000000000000000000000000000000000000000000000"
                  }
                }
              ],
              revoked: { equals: false }
            } 
          },
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: !!formattedAddress,
  });

  return {
    vouchesMade,
    isLoading: isVouchesMadeLoading
  };
};
export const useVoteDetails = (
  graphqlEndpoint: string,
  attester: string | undefined,
  pageSize: number = 10,
  pageNumber: number = 1
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['attestationDetails', attester, pageSize, pageNumber],
    queryFn: async () => {
      if (!attester) return null;
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ATTESTATION_DETAILS,
          variables: {
            where: {
              attester: { equals: attester },
              schemaId: { equals: EAS_CONFIG.VOUCH_SCHEMA },
              AND: [
                {
                  decodedDataJson: {
                    contains: "0x446576636f6e0000000000000000000000000000000000000000000000000000"
                  }
                },
                {
                  decodedDataJson: {
                    contains: "0x536f6369616c53746572656f0000000000000000000000000000000000000000"
                  }
                },
                {
                  decodedDataJson: {
                    contains: "0x4d75736963000000000000000000000000000000000000000000000000000000"
                  }
                }
              ],
              revoked: { equals: false }
            },
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
          },
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: !!attester,
  });

  return {
    attestations: data?.data?.attestations,
    isLoading,
    error,
  };
};

