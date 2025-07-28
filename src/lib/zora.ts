// TypeScript interfaces for the GraphQL response
export interface WalletAllocation {
  claimStatus: string
  tokens: string
  walletAddress: string
  walletType: string
}

export interface TotalTokensEarned {
  totalTokens: string
  walletAllocation: WalletAllocation[]
}

export interface ZoraTokenAllocation {
  totalTokensEarned: TotalTokensEarned
}

export interface AirdropAllocationsResponse {
  zoraTokenAllocation: ZoraTokenAllocation
}

export const getAirdropAllocations = async (
  addresses: string[]
): Promise<AirdropAllocationsResponse> => {
  try {
    const response = await fetch('/api/zora', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ addresses }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching airdrop allocations:', error)
    throw error
  }
}
