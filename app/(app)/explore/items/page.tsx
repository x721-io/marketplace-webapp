'use client'

import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useFilters } from '@/hooks/useFilters'
import NFTsList from '@/components/List/NFTsList'

export default function ExploreNFTsPage() {
  const { isFiltersVisible } = useFilters()
  const api = useMarketplaceApi()
  const { data, error, isLoading } = useSWR('collections', () => api.fetchNFTs({
    page: 1,
    limit: 20
  }))

  return (
    <NFTsList showFilters={isFiltersVisible} items={data?.data}/>
  )
}