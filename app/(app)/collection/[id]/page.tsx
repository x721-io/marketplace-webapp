'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useNFTFilters } from '@/hooks/useFilters'
import { sanitizeObject } from '@/utils'
import { APIParams } from '@/services/api/types'
import NFTsList from '@/components/List/NFTsList'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import defaultCoverPhoto from '@/assets/images/default-cover-photo.png'
import { parseImageUrl } from '@/utils/nft'
import { formatEther } from 'ethers'
import BannerSectionCollection from './component/BannerSection'
import InformationSectionCollection from './component/InformationSection'
import FiltersSectionCollection from './component/FiltersCollectionSection'

export default function CollectionPage() {
  const { id } = useParams()
  const api = useMarketplaceApi()
  const [showFilters, setShowFilters] = useState(false)
  const { activeFilters, handleApplyFilters, handleChangePage } = useNFTFilters()

  const { data, isLoading: isFetchingCollection } = useSWR(
    !!id ? id : null,
    (id: string) => api.fetchCollectionById(id),
    { refreshInterval: 30000 }
  )

  const { data: items, isLoading: isFetchingItems } = useSWR(
    data?.collection.address ? [data?.collection.address, activeFilters] : null,
    ([address, filters]) => api.fetchNFTs(sanitizeObject({
      ...filters,
      collectionAddress: address
    }) as APIParams.FetchNFTs),
    { refreshInterval: 30000 }
  )
  return (
    <div className="w-full relative">
      <BannerSectionCollection
        cover={data?.collection.coverImage ? parseImageUrl(data?.collection.coverImage) : defaultCoverPhoto}
        avatar={data?.collection.avatar ? parseImageUrl(data?.collection.avatar) : defaultAvatar} />

      <InformationSectionCollection
        name={data?.collection.name}
        description={data?.collection.description}
        floorPrice={formatEther(data?.collection.floorPrice || 0).toString()}
        volumn={formatEther(data?.collection.volumn || 0).toString()}
        totalNft={data?.collection.totalNft}
        totalOwner={data?.collection.totalOwner}
      />

      <div className="mt-10 desktop:px-20 tablet:px-20 px-4">
        <FiltersSectionCollection showFilters={showFilters} setShowFilters={() => setShowFilters(!showFilters)} />
        
        <NFTsList
          filters={['status', 'price']}
          onApplyFilters={handleApplyFilters}
          onChangePage={handleChangePage}
          showFilters={showFilters}
          items={items?.data}
          paging={items?.paging}
          traitFilters={data?.traitAvailable}
          onClose={() => setShowFilters(false)}
        />
      </div>
    </div>
  )
}