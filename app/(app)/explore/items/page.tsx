'use client'

import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useExploreSectionFilters, useNFTFilters } from '@/hooks/useFilters'
import NFTsList from '@/components/List/NFTsList'
import { APIParams } from '@/services/api/types'
import { sanitizeObject } from '@/utils'
import { useUIStore } from '@/store/ui/store'

export default function ExploreNFTsPage() {
  const api = useMarketplaceApi()
  const { isFiltersVisible, handleToggleFilters } = useExploreSectionFilters()
  const { activeFilters, handleApplyFilters, handleChangePage } = useNFTFilters()

  const { queryString } = useUIStore(state => state)
  const { searchKey } = useExploreSectionFilters()

  const { data, isLoading } = useSWR(
    { ...activeFilters, name: queryString[searchKey] },
    (params) => api.fetchNFTs(sanitizeObject(params) as APIParams.FetchNFTs),
    { refreshInterval: 5000 }
  )

  return (
    <NFTsList
      onApplyFilters={handleApplyFilters}
      onChangePage={handleChangePage}
      showFilters={isFiltersVisible}
      items={data?.data}
      paging={data?.paging}
      onClose={handleToggleFilters}
    />
  )
}