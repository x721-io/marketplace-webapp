'use client'

import UploadIcon from '@/components/Icon/Upload'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useExploreSectionFilters, useNFTFilters } from '@/hooks/useFilters'
import { sanitizeObject } from '@/utils'
import { APIParams } from '@/services/api/types'
import NFTsList from '@/components/List/NFTsList'
import ExploreSectionNavbar from '@/components/Layout/ExploreNavbar'
import SliderIcon from '@/components/Icon/Sliders'
import Button from '@/components/Button'
import { Dropdown } from 'flowbite-react'
import Icon from '@/components/Icon'
import CommandIcon from '@/components/Icon/Command'
import Input from '@/components/Form/Input'

export default function CollectionPage() {
  const { id } = useParams()
  const api = useMarketplaceApi()
  const [showFilters, setShowFilters] = useState(false)
  const { activeFilters, handleApplyFilters, handleChangePage } = useNFTFilters()

  const { data, isLoading } = useSWR(
    ['nfts', activeFilters],
    () => api.fetchNFTs(sanitizeObject({ ...activeFilters, collectionAddress: id }) as APIParams.SearchNFT),
    { refreshInterval: 30000 }
  )

  return (
    <div className="w-full relative">
      <div className="bg-cover rounded-2xl relative w-full h-[180px]"
           style={{ background: 'var(--gradient-001, linear-gradient(90deg, #22C746 -2.53%, #B0F445 102.48%))' }}>
        <div className="rounded-2xl absolute ml-6 block w-[120px] h-[120px]"
             style={{
               bottom: "-46px",
               background: 'var(--gradient-002, linear-gradient(86deg, #5D96FF 4.33%, #D466FF 99.12%))'
             }}></div>
        <div className="absolute right-2 top-2">
          <button className="bg-button-secondary py-3 px-4 h-12 w-12 rounded-xl ">
            <UploadIcon />
          </button>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap">
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

        <Input
          className="py-4 h-14"
          appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
          appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5" />

        <NFTsList
          onApplyFilters={handleApplyFilters}
          onChangePage={handleChangePage}
          showFilters={showFilters}
          items={data?.data}
          paging={data?.paging}
        />
      </div>
    </div>
  )
}