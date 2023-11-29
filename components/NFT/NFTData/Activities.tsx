import { Table } from 'flowbite-react'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { useState } from 'react'
import useSWR from 'swr'
import { APIResponse } from '@/services/api/types'
import { format } from 'date-fns'
import { findTokenByAddress } from '@/utils/token'
import { formatUnits } from 'ethers'
import Link from 'next/link'

export default function ActivitiesTab({ nft }: { nft: APIResponse.NFT }) {
  const api = useMarketplaceApi()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const { data, isLoading } = useSWR(
    ['nft-activities'],
    () => api.fetchNFTEvents({ page, limit, and: [{ nftId: nft.id }] }),
    { refreshInterval: 300000 }
  )

  return (
    <div className="py-7 overflow-x-auto">
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
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
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
                    {formatUnits(row.price, token?.decimal)} - {token?.symbol}
                  </Table.Cell>
                </Table.Row>
              )
            })
          }
        </Table.Body>
      </Table>
    </div>
  )
}