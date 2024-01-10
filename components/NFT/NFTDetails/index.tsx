'use client'

import { useParams, useRouter } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import Text from '@/components/Text'
import NFTData from '@/components/NFT/NFTData'
import Image from 'next/image'
import NFTMarketData from '@/components/NFT/NFTDetails/MarketData'
import Icon from '@/components/Icon'
import { Spinner } from 'flowbite-react'
import React, { useMemo } from 'react'
import { ALLOWED_AUDIO_TYPES, ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from '@/config/constants'
import useSWRImmutable from 'swr/immutable'

export default function NFTDetails() {
  const router = useRouter()
  const { id, collectionAddress } = useParams()
  const api = useMarketplaceApi()

  const { data: item, isLoading, error } = useSWRImmutable(
    ['nft-details', { collectionAddress: String(collectionAddress), id: String(id) }],
    ([_, params]) => api.fetchNFTById(params)
  )

  const { data: marketData } = useSWR(
    ['nft-market-data', { collectionAddress: String(collectionAddress), id: String(id) }],
    ([_, params]) => api.fetchMarketDataByNFT({
      ...params,
      bidListPage: 1,
      bidListLimit: 100
    }),
    { refreshInterval: 10000 }
  )

  const { data: metaData } = useSWRImmutable(
    !!item?.tokenUri ? item.tokenUri : null,
    (uri) => api.getNFTMetaData(uri),
    { refreshInterval: 600000 }
  )

  const displayMedia = useMemo(() => item?.animationUrl || item?.image, [item])
  const fileExtension = useMemo(() => displayMedia?.split('.').pop(), [displayMedia])

  const fileType = useMemo(() => {
    if (!fileExtension) return 'image'

    switch (true) {
      case ALLOWED_AUDIO_TYPES.includes(fileExtension):
        return 'audio'
      case ALLOWED_VIDEO_TYPES.includes(fileExtension):
        return 'video'
      case ALLOWED_IMAGE_TYPES.includes(fileExtension):
        return 'image'
      default:
        return 'image'
    }
  }, [displayMedia, fileExtension])

  const renderMedia = () => {
    if (!displayMedia) return null
    switch (fileType) {
      case "audio":
        return (
          <div className="relative desktop:h-[512px] tablet:h-auto w-full h-[280px] p-2 rounded-2xl mb-10">
            <Image
              src={item?.image || ''}
              alt=""
              width={512}
              height={512}
              className="object-cover w-full h-full rounded-2xl" />
            <audio className="w-[95%] absolute bottom-1 h-[25px]" controls>
              <source src={displayMedia} type={`${fileType}/${fileExtension}`} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )
      case "video":
        return (
          <video
            className="desktop:w-[512px] desktop:h-[512px] tablet:h-auto w-full h-[280px] rounded-2xl mb-10"
            controls>
            <source src={displayMedia} type={`${fileType}/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        )
      case "image":
        return (
          <Image
            src={displayMedia}
            alt=""
            width={512}
            height={512}
            className="object-cover desktop:w-[512px] desktop:h-[512px] tablet:h-auto w-full h-[280px] rounded-2xl mb-10" />
        )
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-96 p-10 flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (error && !item) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <Text variant="heading-xs" className="text-center">
          Network Error!
          <br />
          Please try again later
        </Text>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <Text variant="heading-xs">
          Item not found!
        </Text>
      </div>
    )
  }

  return (
    <div className='flex w-full flex-col justify-center items-center gap-4 px-4 tablet:px-10 desktop:px-20 py-4 tablet:py-8 desktop:py-10'>
      <div className='flex justify-center items-center desktop:flex-row tablet:flex-row flex-col w-full desktop:gap-10 tablet:gap-10'>
        <div className='flex gap-4 desktop:flex-row tablet:flex-row flex-col w-full desktop:w-auto tablet:w-auto'>
          <div className="p-2" onClick={router.back}>
            <Icon
              className="cursor-pointer" name="arrowLeft"
              width={24}
              height={24}
            />
          </div>
          {renderMedia()}
        </div>
        <div className='w-full desktop:w-auto tablet:w-auto'>
          <NFTMarketData nft={item} marketData={marketData} />
        </div>
      </div>
      <div className='w-full'>
        <NFTData marketData={marketData} nft={item} metaData={metaData} />
      </div>
    </div>
  )
}