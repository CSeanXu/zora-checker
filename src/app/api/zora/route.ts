import { type NextRequest } from 'next/server'
import { GraphQLClient, gql } from 'graphql-request'

const API_URL = 'https://api.zora.co/universal/graphql'

const query = gql`
  query useAccountAllocationsDataQuery(
    $identifiers: [String!]!
    $chainId: Int!
    $zoraClaimContractEnv: EZoraClaimContractEnv!
  ) {
    zoraTokenAllocation(
      identifierWalletAddresses: $identifiers
      chainId: $chainId
      zoraClaimContractEnv: $zoraClaimContractEnv
    ) {
      totalTokensEarned {
        totalTokens
        walletAllocation {
          claimStatus
          tokens
          walletAddress
          walletType
        }
      }
    }
  }
`

const client = new GraphQLClient(API_URL)

export async function POST(request: NextRequest) {
  const { addresses } = await request.json()

  const variables = {
    identifiers: addresses,
    chainId: 8453, // Base mainnet
    zoraClaimContractEnv: 'PRODUCTION',
  }

  try {
    const data = await client.request(query, variables, {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      'content-type': 'application/json',
      origin: 'https://claim.zora.co',
      referer: 'https://claim.zora.co/',
    })
    return Response.json(data)
  } catch (error) {
    console.error('Error fetching airdrop allocations:', error)
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
