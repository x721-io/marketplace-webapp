'use client'

import CollectionFilters from '@/components/Filters/CollectionFilters'
import { useExploreSectionFilters } from '@/hooks/useFilters'

export default function ExploreCollectionFilters() {
  const { isFiltersVisible } = useExploreSectionFilters()

  if (!isFiltersVisible) return null

  return <CollectionFilters />
}