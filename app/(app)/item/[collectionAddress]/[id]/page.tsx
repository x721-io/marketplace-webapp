'use client'

import { useParams, useRouter } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import Text from '@/components/Text'
import NFTData from '@/components/NFT/NFTData'
import NFTMarketData from '@/components/Pages/MarketplaceNFT/NFTDetails/MarketData'
import NFTImage from '@/components/Pages/MarketplaceNFT/NFTDetails/NFTImage'
import Icon from '@/components/Icon'
import { Spinner } from 'flowbite-react'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

export default function NFTPage() {
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
    <div className="flex w-full flex-col justify-center items-center gap-4 px-4 tablet:px-10 desktop:px-20 py-4 tablet:py-8 desktop:py-10">
      <div className="flex justify-center items-center desktop:flex-row tablet:flex-row flex-col w-full desktop:gap-10 tablet:gap-10">
        <div className="flex gap-4 desktop:flex-row tablet:flex-row flex-col w-full desktop:w-auto tablet:w-auto">
          <div className="p-2" onClick={router.back}>
            <Icon
              className="cursor-pointer" name="arrowLeft"
              width={24}
              height={24}
            />
          </div>
          <NFTImage item={item} />
        </div>
        <div className="w-full desktop:w-auto tablet:w-auto">
          <NFTMarketData nft={item} marketData={marketData} />
        </div>
      </div>
      <div className="w-full">
        <NFTData marketData={marketData} nft={item} metaData={metaData} />
      </div>
    </div>
  )
}