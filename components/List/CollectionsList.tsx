import { Table } from 'flowbite-react'
import { APIResponse } from '@/services/api/types'
import { formatEther } from 'ethers'
import Link from 'next/link'

export default function CollectionsList({ collections }: { collections?: APIResponse.Collection[] }) {
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
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Link href={`/collection/${c.id}`}>{c.name}</Link>
              </Table.Cell>
              <Table.Cell>{c.symbol}</Table.Cell>
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