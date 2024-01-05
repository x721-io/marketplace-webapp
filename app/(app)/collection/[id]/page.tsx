'use client'
import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useExploreSectionFilters, useNFTFilters } from '@/hooks/useFilters'
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
import Link from 'next/link'
import Button from '@/components/Button'

export default function CollectionPage() {
  const { id } = useParams()
  const api = useMarketplaceApi()
  const [showFilters, setShowFilters] = useState(false)
  const { query } = useExploreSectionFilters()
  const { activeFilters, handleApplyFilters, handleChangePage } = useNFTFilters()

  const { data, isLoading, error } = useSWR(
    !!id ? id : null,
    (id: string) => api.fetchCollectionById(id),
    { refreshInterval: 30000 }
  )

  const { data: items, isLoading: isFetchingItems } = useSWR(
    data?.collection.address ? [data?.collection.address, { ...activeFilters, name: query }] : null,
    ([address, filters]) => api.fetchNFTs(sanitizeObject({
      ...filters,
      collectionAddress: address
    }) as APIParams.FetchNFTs),
    { refreshInterval: 10000 }
  )

  if (error) {
    return (
      <div className="w-full h-96 flex flex-col gap-4 justify-center items-center">
        <Text variant="heading-xs" className="text-center font-semibold">
          Service Error
        </Text>
        <Text variant="body-16" className="text-center font-medium">
          Please try again later!
        </Text>
      </div>
    )
  }

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
        <div className='flex gap-4'>
          <Link href={data.collection.type === 'ERC721' ? `/create/nft/ERC721` : data.collection.type === 'ERC1155' ? `/create/nft/ERC1155` : ''}>
            <div className="flex items-center justify-center rounded-xl border border-1 hover:border-hard/70 border-soft transition-all h-[295px] w-[250px]">
              <Button variant="primary">
                Create a nft
              </Button>
            </div>
          </Link>
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
    </div>
  )
}