'use client'

import useSWR from 'swr'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import CollectionFilters from '@/components/Filters/CollectionFilters'
import { useExploreSectionFilters } from '@/hooks/useFilters'
import CollectionsList from '@/components/List/CollectionsList'

export default function ExploreCollectionsPage() {
  const api = useMarketplaceApi()
  const { data: collections, error, isLoading } = useSWR('collections', api.fetchCollections)
  const { isFiltersVisible } = useExploreSectionFilters()

  return (
    <div className="flex gap-6">
      {isFiltersVisible && <CollectionFilters />}

      <div className="flex-1">
        <CollectionsList collections={collections} />
      </div>
    </div>
  )
}