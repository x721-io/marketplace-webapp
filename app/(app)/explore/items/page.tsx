'use client'

import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR, { useSWRConfig } from 'swr'
import { useFilters } from '@/hooks/useFilters'
import NFTsList from '@/components/List/NFTsList'
import { parseEther } from 'ethers'
import { useState } from 'react'
import { APIParams } from '@/services/api/types'
import { sanitizeObject } from '@/utils'



export default function ExploreNFTsPage() {
  const api = useMarketplaceApi()
  const { isFiltersVisible } = useFilters()
  const { mutate } = useSWRConfig()
  const [activeFilters, setActiveFilters] = useState<APIParams.SearchNFT>({
    page: 1,
    limit: 20,
    traits: undefined,
    collectionAddress: undefined,
    creatorAddress: undefined,
    priceMax: undefined,
    priceMin: undefined,
    sellStatus: undefined
  })

  const { data, isLoading } = useSWR(
    ['collections', activeFilters],
    () => api.fetchNFTs(sanitizeObject(activeFilters) as APIParams.SearchNFT),
    { refreshInterval: 10000 }
  )

  const handleApplyFilters = ({ type, sellStatus, priceMax, priceMin }: Record<string, any>) => {
    const _activeFilters = {
      ...activeFilters,
      type,
      sellStatus
    }
    if (Number(priceMax)) _activeFilters.priceMax = parseEther(priceMax)
    if (Number(priceMin)) _activeFilters.priceMin = parseEther(priceMin)

    setActiveFilters(_activeFilters)
    mutate('collection')
  }

  return (
    <NFTsList
      onApplyFilters={handleApplyFilters}
      showFilters={isFiltersVisible}
      items={data?.data} />
  )
}