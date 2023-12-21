'use client'

import { useCollectionFilters, useExploreSectionFilters } from '@/hooks/useFilters'
import CollectionFilters from '@/components/Filters/CollectionFilters'
import CollectionsList from '@/components/List/CollectionsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { useState } from 'react'
import { useUIStore } from '@/store/ui/store'
import useSWR from 'swr'
import { sanitizeObject } from '@/utils'
import { APIParams } from '@/services/api/types'

export default function ExploreCollectionsPage() {
  const api = useMarketplaceApi()

  const { activeFilters, handleApplyFilters, handleChangePage  } = useCollectionFilters()

  const { queryString } = useUIStore(state => state)
  const { searchKey } = useExploreSectionFilters()

  const { data: collections, error, isLoading } = useSWR(
    { ...activeFilters, name: queryString[searchKey] },
    (params) => api.fetchCollections(sanitizeObject(params) as APIParams.FetchCollections),
    { refreshInterval: 10000 }
  )

  const { isFiltersVisible } = useExploreSectionFilters()

  return (
    <div className="flex gap-6">
      <CollectionFilters visible={isFiltersVisible} onApplyFilters={handleApplyFilters} />

      <div className="flex-1">
        <CollectionsList
          collections={collections?.data}
          paging={collections?.paging}
          onChangePage={handleChangePage}
        />
      </div>
    </div>
  )
}