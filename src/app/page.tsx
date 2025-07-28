'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2 } from 'lucide-react'
import { getAirdropAllocations } from '@/lib/zora'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

export default function Home() {
  const [address, setAddress] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    const addresses = address.split('\n').filter((a) => a.trim() !== '')
    try {
      const data = await getAirdropAllocations(addresses)
      setResult(data.zoraTokenAllocation.totalTokensEarned.walletAllocation)
    } catch (error) {
      console.error(error)
      // Handle error state in UI
    }
    setLoading(false)
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-8'>
      <div className='w-full max-w-md min-w-full sm:min-w-[400px]'>
        <div className='flex w-full flex-col items-center'>
          <Textarea
            placeholder='EVM Addresses (one per line)'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='h-40'
          />
          <Button
            type='submit'
            onClick={handleSearch}
            disabled={loading}
            className='mt-4 w-full'
          >
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      <div className='min-h-[200px] min-w-full sm:min-w-[400px]'>
        {result && (
          <Table className='mt-8 w-full max-w-md'>
            <TableHeader>
              <TableRow>
                <TableHead>Wallet Address</TableHead>
                <TableHead className='text-right'>Tokens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.map((allocation) => (
                <TableRow key={allocation.walletAddress}>
                  <TableCell className='font-mono text-sm'>
                    {allocation.walletAddress}
                  </TableCell>
                  <TableCell className='text-right font-bold text-lg'>
                    {allocation.tokens} ZORA
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  )
}
