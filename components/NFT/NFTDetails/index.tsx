'use client'

import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import LoadingScreen from '@/components/Layout/LoadingScreen'
import Text from '@/components/Text'
import NFTData from '@/components/NFT/NFTData'
import Image from 'next/image'
import { parseImageUrl } from '@/utils/nft'
import defaultImg from '@/assets/images/carousel-1.png'
import NFTMarketData from '@/components/NFT/NFTDetails/MarketData'

export default function NFTDetails() {
  const { id } = useParams()
  const api = useMarketplaceApi()
  const { data: item, error, isLoading } = useSWR(
    `/item/${id}`,
    () => api.fetchNFTById(id as string),
    { refreshInterval: 10000 }
  )
  const { data: metaData} = useSWR(
    !!item?.tokenUri ? item.tokenUri : null,
    () => api.getNFTMetaData(item?.tokenUri || ''),
    { refreshInterval: 600000 }
  )

  if (isLoading) {
    return (
      <LoadingScreen />
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
    <div className="w-full px-4 tablet:px-10 desktop:px-20 py-4 tablet:py-8 desktop:py-10">
      <div className="flex items-start justify-center flex-col desktop:flex-row tablet:flex-row gap-8 desktop:gap-16 tablet:gap-16">
        <div className="">
          <Image
            src={item.imageHash ? parseImageUrl(item.imageHash) : defaultImg}
            alt=""
            width={512}
            height={512}
            className="object-cover desktop:w-[512px] desktop:h-[512px] tablet:w-[424px] tablet:h-[424px] w-full h-[280px] rounded-2xl mb-10" />
          <NFTData nft={item} metaData={metaData} />
        </div>
        <NFTMarketData nft={item} />
      </div>
    </div>
  )
}