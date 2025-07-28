import { GraphQLClient, gql } from 'graphql-request'

const API_URL = 'https://api.zora.co/universal/graphql'

// TypeScript interfaces for the GraphQL response
interface WalletAllocation {
  claimStatus: string
  tokens: string
  walletAddress: string
  walletType: string
}

interface TotalTokensEarned {
  totalTokens: string
  walletAllocation: WalletAllocation[]
}

interface ZoraTokenAllocation {
  totalTokensEarned: TotalTokensEarned
}

interface AirdropAllocationsResponse {
  zoraTokenAllocation: ZoraTokenAllocation
}

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

export const getAirdropAllocations = async (
  addresses: string[]
): Promise<AirdropAllocationsResponse> => {
  const variables = {
    identifiers: addresses,
    chainId: 8453, // Base mainnet
    zoraClaimContractEnv: 'PRODUCTION',
  }

  try {
    const data = await client.request<AirdropAllocationsResponse>(
      query,
      variables,
      {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'content-type': 'application/json',
        origin: 'https://claim.zora.co',
        referer: 'https://claim.zora.co/',
      }
    )
    return data
  } catch (error) {
    console.error('Error fetching airdrop allocations:', error)
    throw error
  }
}

// Export the types for use in other files
export type { WalletAllocation, AirdropAllocationsResponse }
