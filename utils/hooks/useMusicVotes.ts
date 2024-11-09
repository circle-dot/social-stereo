import { useQuery } from '@tanstack/react-query';
import ATTESTATION_DETAILS from '../../graphql/queries/UserProfile/AttestationDetails';
import COUNT_ATTESTATIONS_MADE from '@/graphql/queries/AttestationsMadeCount';
import { EAS_CONFIG } from '@/config/site';
import communities from '@/data/communities.json';

export const useVoteCounts = (graphqlEndpoint: string, formattedAddress: string | undefined, org: string) => {
  const communityFilters = communities[org as keyof typeof communities];

  const { data: vouchesMade, isLoading: isVouchesMadeLoading } = useQuery({
    queryKey: ['vouchesMade', formattedAddress, org],
    queryFn: async () => {
      if (!formattedAddress || !communityFilters) return null;
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
                    contains: communityFilters.FirstFilter
                  }
                },
                {
                  decodedDataJson: {
                    contains: communityFilters.SecondFilter
                  }
                },
                {
                  decodedDataJson: {
                    contains: communityFilters.ThirdFilter
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
    enabled: !!formattedAddress && !!communityFilters,
  });

  return {
    vouchesMade,
    isLoading: isVouchesMadeLoading
  };
};

export const useVoteDetails = (
  graphqlEndpoint: string,
  attester: string | undefined,
  org: string,
  pageSize: number = 10,
  pageNumber: number = 1
) => {
  const communityFilters = communities[org as keyof typeof communities];

  const { data, isLoading, error } = useQuery({
    queryKey: ['attestationDetails', attester, org, pageSize, pageNumber],
    queryFn: async () => {
      if (!attester || !communityFilters) return null;
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
                    contains: communityFilters.FirstFilter
                  }
                },
                {
                  decodedDataJson: {
                    contains: communityFilters.SecondFilter
                  }
                },
                {
                  decodedDataJson: {
                    contains: communityFilters.ThirdFilter
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
    enabled: !!attester && !!communityFilters,
  });

  return {
    attestations: data?.data?.attestations,
    isLoading,
    error,
  };
};

