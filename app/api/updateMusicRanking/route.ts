import { NextResponse } from 'next/server';
import { EAS_CONFIG } from '@/config/site';
const query = `
  query Attestations($where: AttestationWhereInput) {
    attestations(where: $where) {
      recipient
    }
  }
`;

const variables = {
  where: {
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
    schemaId: {
      equals: "0xa142412d946732a5a336236267a625ab2bc5c51b9d6f0703317bc979432ced66"
    }
  }
};

export async function GET() {
  try {
    const response = await fetch(EAS_CONFIG.GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from EAS GraphQL endpoint');
    }

    const data = await response.json();
    const attestations = data.data.attestations;

    // Count occurrences of each recipient
    const recipientCounts = attestations.reduce((acc: Record<string, number>, attestation: { recipient: string }) => {
      acc[attestation.recipient] = (acc[attestation.recipient] || 0) + 1;
      return acc;
    }, {});

    // Create a sorted ranking
    const ranking = Object.entries(recipientCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([recipient, count], index) => ({ rank: index + 1, recipient, count }));

    // Log the ranking
    console.log('Music Ranking:', ranking);
 

    return NextResponse.json({ message: 'Ranking updated and logged successfully' });
  } catch (error) {
    console.error('Error updating music ranking:', error);
    return NextResponse.json({ error: 'Failed to update music ranking' }, { status: 500 });
  }
}
