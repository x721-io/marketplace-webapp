import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import React, { useState } from 'react'
import { Address } from 'wagmi'
import Text from '@/components/Text'
import UserMarketEvent from '@/app/(app)/user/[id]/components/Activities/MarketEvent'
import useAuthStore from '@/store/auth/store'

export default function Activities({ wallet }: { wallet: Address }) {
  const api = useMarketplaceApi()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(100)

  const { data, isLoading } = useSWR(
    !!wallet ? { page, limit, user: wallet } : null,
    (params) => api.fetchUserActivities(params),
    { refreshInterval: 10000 }
  )

  // const { data, isLoading } = useSWR(
  //   !!wallet ? { wallet, page, limit } : null,
  //   ({ wallet, page, limit }) => api.fetchNFTEvents({ page, limit, or: [{ from: wallet }, { to: wallet }] }),
  //   { refreshInterval: 300000 }
  // )

  if (!data || !data?.length) {
    return (
      <div className="p-7 rounded-2xl border border-disabled border-dashed mt-7">
        <Text className="text-secondary text-center text-sm">Nothing to show</Text>
      </div>
    )
  }

  return (
    <div className="w-full py-4 overflow-x-auto">
      {!!data?.length ? (
        <div className="p-3 flex flex-col gap-4 rounded-2xl border border-disabled border-dashed whitespace-normal">
          {data.map(event => <UserMarketEvent key={event.id} event={event}/>)}
        </div>
      ) : (
        <div className="p-7 rounded-2xl border border-disabled border-dashed">
          <Text className="text-secondary text-center text-bo">Nothing to show</Text>
        </div>
      )}
    </div>
    // <div className="w-full py-4 overflow-x-auto">
    //   <Text variant="body-14" className="text-secondary italic font-semibold mb-3">
    //     Showing latest 100 records
    //   </Text>
    //   <Table striped hoverable className="overflow-x-auto">
    //     <Table.Head>
    //       <Table.HeadCell>Date</Table.HeadCell>
    //       <Table.HeadCell>Event</Table.HeadCell>
    //       <Table.HeadCell>NFT</Table.HeadCell>
    //       <Table.HeadCell>Price</Table.HeadCell>
    //       {/*<Table.HeadCell>*/}
    //       {/*  <span className="sr-only">Action</span>*/}
    //       {/*</Table.HeadCell>*/}
    //     </Table.Head>
    //     <Table.Body className="divide-y">
    //       {
    //         Array.isArray(data) && data.map(row => {
    //           if (!row?.nftId) {
    //             return null
    //           }
    //           const token = findTokenByAddress(row.quoteToken)
    //           return (
    //             <Table.Row key={row.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
    //               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
    //                 {format(Number(row.timestamp) * 1000, 'yyyy-MM-dd HH:mm:ss')}
    //               </Table.Cell>
    //               <Table.Cell>
    //                 {row.event}
    //               </Table.Cell>
    //               <Table.Cell>
    //                 <Link href={`/item/${row.nftId.contract.id}/${row.nftId.tokenId}`}>
    //                   {row.nftId.contract.name} - {row.nftId.tokenId}
    //                 </Link>
    //               </Table.Cell>
    //               <Table.Cell>
    //                 {formatDisplayedBalance(formatUnits(row.price, token?.decimal), 2)} {token?.symbol}
    //               </Table.Cell>
    //             </Table.Row>
    //           )
    //         })
    //       }
    //     </Table.Body>
    //   </Table>
    // </div>
  )
}