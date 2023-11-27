'use client'

import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import NFTCard from '@/components/NFT/NFTCard'
import { useState } from 'react'
import { classNames } from '@/utils/string'
import Filters from '@/components/Filters'
import NFTFilters from '@/components/Filters/NFTFilters'
import { useFilters } from '@/hooks/useFilters'

export default function ExploreNFTsPage() {
  const { isFiltersVisible } = useFilters()
  const api = useMarketplaceApi()
  const { data, error, isLoading } = useSWR('collections', () => api.fetchNFTs({
    page: 1,
    limit: 20
  }))

  return (
    <div className="w-full flex gap-12">
      {isFiltersVisible && <NFTFilters />}

      <div className="flex-1">
        <div className={
          classNames(
            'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 md:gap-3 transition-all',
            isFiltersVisible ? 'lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:gap-3' : 'lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 md:gap-3'
          )
        }>
          {
            Array.isArray(data?.data) && data?.data.map(item => (
              <NFTCard {...item} />
            ))
          }
        </div>
      </div>
    </div>
  )
}