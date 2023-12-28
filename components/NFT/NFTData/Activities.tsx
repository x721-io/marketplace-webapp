import { Table } from 'flowbite-react'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import React, { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import { findTokenByAddress } from '@/utils/token'
import { formatUnits } from 'ethers'
import Link from 'next/link'
import Text from '@/components/Text'
import { formatDisplayedBalance } from '@/utils'
import { NFT } from '@/types'

export default function ActivitiesTab({ nft }: { nft: NFT }) {
  const api = useMarketplaceApi()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const { data, isLoading } = useSWR(
    ['nft-activities'],
    () => api.fetchNFTEvents({
      page,
      limit,
      and: [{
        nftId_: {
          tokenId: nft.u2uId ?? nft.id, contract_contains: nft.collection.address
        }
      }]
    }),
    { refreshInterval: 300000 }
  )


  return (
    <div className="py-7 overflow-x-auto">
      {!!data?.length ? (
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Event</Table.HeadCell>
            <Table.HeadCell>Buyer</Table.HeadCell>
            <Table.HeadCell>Seller</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {
              Array.isArray(data) && data.map(row => {
                const token = findTokenByAddress(row.quoteToken)

                return (
                  <Table.Row key={row.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {format(Number(row.timestamp) * 1000, 'yyyy-MM-dd HH:mm:ss')}
                    </Table.Cell>
                    <Table.Cell>{row.event}</Table.Cell>
                    <Table.Cell>
                      <Link href={`/user/${row.to}`}>{row.to}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link href={`/user/${row.from}`}>{row.from}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      {formatDisplayedBalance(formatUnits(row.price, token?.decimal), 2)} - {token?.symbol}
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      ): (
        <div className="p-7 rounded-2xl border border-disabled border-dashed">
          <Text className="text-secondary text-center text-bo">Nothing to show</Text>
        </div>
      )}
    </div>
  )
}