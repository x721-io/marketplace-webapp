'use client'
import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useNFTFilters } from '@/hooks/useFilters'
import { sanitizeObject } from '@/utils'
import { APIParams } from '@/services/api/types'
import NFTsList from '@/components/List/NFTsList'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import defaultCoverPhoto from '@/assets/images/default-cover-photo.png'
import BannerSectionCollection from './component/BannerSection'
import InformationSectionCollection from './component/InformationSection'
import FiltersSectionCollection from './component/FiltersCollectionSection'
import { Spinner } from 'flowbite-react'
import Text from '@/components/Text'

export default function CollectionPage() {
  const { id } = useParams()
  const api = useMarketplaceApi()
  const [showFilters, setShowFilters] = useState(false)
  const { activeFilters, handleApplyFilters, handleChangePage } = useNFTFilters()

  const { data, isLoading } = useSWR(
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
    { refreshInterval: 10000 }
  )

  if (isLoading) {
    return (
      <div className="w-full h-96 p-10 flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!data?.collection) {
    return (
      <div className="w-full h-96 p-10 flex justify-center items-center">
        <Text className="font-semibold text-body-32">
          Collection does not exist!
        </Text>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      <BannerSectionCollection
        collectionId={data.collection.id}
        creators={data?.collection?.creators}
        cover={data?.collection.coverImage || defaultCoverPhoto}
        avatar={data?.collection.avatar || defaultAvatar} />

      <InformationSectionCollection data={data} />

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