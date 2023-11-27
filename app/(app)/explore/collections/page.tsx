'use client'

import useSWR from 'swr'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { Table } from 'flowbite-react';
import CollectionFilters from '@/components/Filters/CollectionFilters'
import { useFilters } from '@/hooks/useFilters'

export default function ExploreCollectionsPage() {
  const api = useMarketplaceApi()
  const { data: collections, error, isLoading } = useSWR('collections', api.fetchCollections)
  const { isFiltersVisible } = useFilters()

  return (
    <div className="flex gap-6">
      {isFiltersVisible && <CollectionFilters/>}

      <div className="flex-1">
        <Table hoverable>
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
      </div>
    </div>
  )
}