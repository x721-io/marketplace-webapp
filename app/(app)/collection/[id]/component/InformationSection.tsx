'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { ListGroup } from 'flowbite-react'
import Icon from '@/components/Icon'
import Text from '@/components/Text'
import { formatEther } from 'ethers'

export default function InformationSectionCollection() {
  const { id } = useParams()
  const api = useMarketplaceApi()

  const { data, isLoading: isFetchingCollection } = useSWR(
    !!id ? id : null,
    (id: string) => api.fetchCollectionById(id),
    { refreshInterval: 30000 }
  )
  return (
    <>
      <div className="w-full flex justify-between pt-20 desktop:px-20 tablet:px-20 px-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 justify-between">
            <Text className="font-semibold desktop:text-body-32 tablet:text-body-32 text-body-24">
              {data?.collection.name}
            </Text>
            <Icon name="verified" width={24} height={24} />
          </div>
          <div>
            <Text className="text-secondary text-sm">
              {data?.collection.description}
            </Text>
          </div>
        </div>
      </div>
      <div className='w-11/12 desktop:w-3/4 tablet:w-3/4 bg-surface-soft rounded-2xl py-3 px-6 flex desktop:mx-20 tablet:mx-20 mx-4 flex-col desktop:flex-row tablet:flex-row gap-3 desktop:gap-0 tablet:gap-0'>
        <div className='flex flex-1 justify-around'>
          <div className='flex flex-col items-center'>
            <Text className='text-secondary'>Floor</Text>
            <Text className="text-primary font-bold flex items-center gap-1" variant="body-16">
              {formatEther(data?.collection.floorPrice || 0).toString()} <Text className='text-secondary font-normal'>U2U</Text>
            </Text>
          </div>
          <div className='flex flex-col items-center'>
            <Text className='text-secondary'>Volume</Text>
            <Text className="text-primary font-bold flex items-center gap-1" variant="body-16">
              {formatEther(data?.collection.volumn || 0).toString()} <Text className='text-secondary font-normal'>U2U</Text>
            </Text>
          </div>
          <div className='flex flex-col items-center'>
            <Text className='text-secondary'>Items</Text>
            <Text className="text-primary font-bold" variant="body-16">
              {data?.collection.totalNft}
            </Text>
          </div>
        </div>
        <div className='flex flex-1 justify-around'>
          <div className='flex flex-col items-center'>
            <Text className='text-secondary'>Owner</Text>
            <Text className="text-primary font-bold" variant="body-16">
              {data?.collection.totalOwner}
            </Text>
          </div>
          <div className='flex flex-col items-center'>
            <Text className='text-secondary'>Royalties</Text>
            <Text className="text-primary font-bold" variant="body-16">
              2.5%
            </Text>
          </div>
        </div>
      </div>
    </>
  )
}