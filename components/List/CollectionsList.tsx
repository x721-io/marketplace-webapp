import { Table } from 'flowbite-react'
import { APIResponse } from '@/services/api/types'
import { formatEther } from 'ethers'
import Link from 'next/link'
import Text from '@/components/Text'
import React from 'react'

export default function CollectionsList({ collections }: { collections?: APIResponse.Collection[] }) {
  if (!collections || !collections.length) {
    return (
      <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
        <Text className="text-secondary font-semibold text-body-18">Nothing to show</Text>
      </div>
    )
  }

  return (
    <Table hoverable striped className='overflow-x-auto'>
      <Table.Head>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Symbol</Table.HeadCell>
        <Table.HeadCell>Floor price</Table.HeadCell>
        <Table.HeadCell>Volume</Table.HeadCell>
        <Table.HeadCell>Items</Table.HeadCell>
        <Table.HeadCell>Owners</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {
          Array.isArray(collections) && collections.map(c => (
            <Table.Row key={c.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-normal font-medium text-gray-900 max-w-[300px] overflow-hidden">
                <Link className="text-ellipsis hover:underline" href={`/collection/${c.shortUrl}`}>
                  {c.name}
                </Link>
              </Table.Cell>
              <Table.Cell className="whitespace-normal max-w-[3000px] overflow-hidden">{c.symbol}</Table.Cell>
              <Table.Cell>{parseFloat(formatEther(c.floorPrice)).toFixed(2)} U2U</Table.Cell>
              <Table.Cell>{parseFloat(formatEther(c.volumn)).toFixed(2)} U2U</Table.Cell>
              <Table.Cell>{c.totalNft}</Table.Cell>
              <Table.Cell>{c.totalOwner}</Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  )
}