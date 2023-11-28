import { Table } from 'flowbite-react'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useState } from 'react'
import useAuthStore from '@/store/auth/store'
import { findTokenByAddress } from '@/utils/token'
import { formatUnits } from 'ethers'
import Link from 'next/link'
import { format } from 'date-fns'

export default function Activities() {
  const userWallet = useAuthStore(state => state.profile?.publicKey)
  const api = useMarketplaceApi()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const { data, isLoading } = useSWR(
    ['collections', { page, limit }],
    () => api.fetchNFTEvents({ page, limit, or: [{ from: userWallet }, { to: userWallet }] }),
    { refreshInterval: 300000 }
  )

  return (
    <div className="w-full py-7">
      <Table striped hoverable>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Event</Table.HeadCell>
          <Table.HeadCell>NFT</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          {/*<Table.HeadCell>*/}
          {/*  <span className="sr-only">Action</span>*/}
          {/*</Table.HeadCell>*/}
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
                  <Table.Cell>
                    {row.event}
                  </Table.Cell>
                  <Table.Cell>
                    <Link href={`/item/${row.nftId.id}`}>
                      {row.nftId.contract.name} - {row.nftId.id}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {formatUnits(row.price, token?.decimal)} {token?.symbol}
                  </Table.Cell>
                </Table.Row>
              )
            })
          }
        </Table.Body>
      </Table>

      <div className="flex justify-end">
      </div>
    </div>
  )
}