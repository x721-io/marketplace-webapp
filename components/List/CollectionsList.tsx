import { Table } from 'flowbite-react'
import { APIResponse } from '@/services/api/types'

export default function CollectionsList({ collections }: { collections?: APIResponse.Collection[] }) {
  return (
    <Table hoverable striped>
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
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {c.name}
              </Table.Cell>
              <Table.Cell>{c.symbol}</Table.Cell>
              <Table.Cell>{0}</Table.Cell>
              <Table.Cell>{0}</Table.Cell>
              <Table.Cell>{0}</Table.Cell>
              <Table.Cell>{0}</Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  )
}