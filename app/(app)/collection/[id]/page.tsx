'use client'

import UploadIcon from '@/components/Icon/Upload'
import React, { useRef, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useNFTFilters } from '@/hooks/useFilters'
import { sanitizeObject } from '@/utils'
import { APIParams } from '@/services/api/types'
import NFTsList from '@/components/List/NFTsList'
import SliderIcon from '@/components/Icon/Sliders'
import Button from '@/components/Button'
import { Dropdown, ListGroup } from 'flowbite-react'
import Icon from '@/components/Icon'
import CommandIcon from '@/components/Icon/Command'
import Input from '@/components/Form/Input'
import Image from 'next/image'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import defaultCoverPhoto from '@/assets/images/default-cover-photo.png'
import Text from '@/components/Text'
import { parseImageUrl } from '@/utils/nft'
import { formatEther } from 'ethers'
import BannerSection from '../../profile/component/BannerSection'
import BannerSectionCollection from './component/BannerSection'
import InformationSectionCollection from './component/InformationSection'
import ListSectionCollection from './component/ListCollectionSection'

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
    }) as APIParams.SearchNFT),
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
        <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap mb-4 tablet:mb-8 desktop:mb-8">
          <div className="order-3 desktop:order-1">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-white shadow' : `bg-surface-soft`}
              scale="lg"
              variant="secondary">
              Filters
              <span className="p-1 bg-surface-medium rounded-lg">
                <SliderIcon width={14} height={14} />
              </span>
            </Button>
          </div>
          <div className="relative flex-1 order-2 desktop:order-3 min-w-[180px]">
            <Input
              className="py-4 h-14 w-full"
              appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
              appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5" />
          </div>
          <div className="order-4">
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <div className="bg-surface-soft flex items-center justify-center gap-3 rounded-2xl p-3 h-full cursor-pointer">
                  Price: Ascending
                  <div className="rounded-lg p-1 bg-surface-medium">
                    <Icon name="chevronDown" width={14} height={14} />
                  </div>
                </div>
              )}>
              <Dropdown.Item>Price: Ascending</Dropdown.Item>
              <Dropdown.Item>Price: Descending</Dropdown.Item>
              <Dropdown.Item>Date: Ascending</Dropdown.Item>
              <Dropdown.Item>Date: Descending</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        {/* <ListSectionCollection showFilters={showFilters} setShowFilters={setShowFilters} /> */}
        <NFTsList
          filters={['status', 'price']}
          onApplyFilters={handleApplyFilters}
          onChangePage={handleChangePage}
          showFilters={showFilters}
          items={items?.data}
          paging={items?.paging}
          traitFilters={data?.traitAvailable}
        />
      </div>
    </div>
  )
}