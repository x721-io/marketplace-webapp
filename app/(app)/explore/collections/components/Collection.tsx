'use client'

import CollectionsList from '@/components/List/CollectionsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'

export default function ExploreCollectionList() {
  const api = useMarketplaceApi()
  const { data: collections, error, isLoading } = useSWR('collections', api.fetchCollections)

  return <CollectionsList collections={collections} />
}