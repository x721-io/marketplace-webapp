'use client'

import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import LoadingScreen from '@/components/Layout/LoadingScreen'
import Text from '@/components/Text'
import NFTData from '@/components/NFT/NFTData'
import NFTDetailsHeader from '@/components/NFT/NFTDetails/Header'

export default function NFTDetails() {
  const { id } = useParams()
  const api = useMarketplaceApi()
  const { data: item, error, isLoading } = useSWR(
    `/item/${id}`,
    () => api.fetchNFTById(id as string),
    { refreshInterval: 300000 }
  )

  if (isLoading) {
    return (
      <LoadingScreen />
    )
  }

  if (!item) {
    return (
      <div className="w-full flex justify-center items-center">
        <Text variant="heading-xs">
          Item not found!
        </Text>
      </div>
    )
  }

  return (
    <div className="w-full px-4 tablet:px-10 desktop:px-20  py-4 tablet:py-8 desktop:py-10">
      <NFTDetailsHeader {...item} />
      <NFTData {...item} />
    </div>
  )
}