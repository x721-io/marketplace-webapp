import { useState } from 'react'
import SliderIcon from '@/components/Icon/Sliders'
import Button from '@/components/Button'
import { classNames } from '@/utils/string'
import NFTsList from '@/components/List/NFTsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { APIParams } from '@/services/api/types'
import useSWR from 'swr'
import { sanitizeObject } from '@/utils'
import { useNFTFilters } from '@/hooks/useFilters'
import useAuthStore from '@/store/auth/store'
import { useParams } from 'next/navigation'
import { Address } from 'wagmi'

export default function CreatedNFTs({ wallet }: { wallet: Address }) {
  const { id } = useParams()
  const [showFilters, setShowFilters] = useState(false)
  const api = useMarketplaceApi()
  const { activeFilters, handleApplyFilters, handleChangePage } = useNFTFilters({
    page: 1,
    limit: 20,
    traits: undefined,
    collectionAddress: undefined,
    creatorAddress: wallet,
    priceMax: undefined,
    priceMin: undefined,
    sellStatus: undefined
  })

  const { data, isLoading } = useSWR(
    ['user-created-nfts', activeFilters],
    () => api.fetchNFTs(sanitizeObject(activeFilters) as APIParams.SearchNFT),
    { refreshInterval: 300000 }
  )

  return (
    <div className="w-full py-7">
      <Button
        onClick={() => setShowFilters(!showFilters)}
        className={classNames(showFilters ? 'bg-white shadow' : `bg-surface-soft`, 'mb-7')}
        scale="sm"
        variant="secondary">
        Filters
        <span className="p-1 bg-surface-medium rounded-lg">
          <SliderIcon width={14} height={14} />
        </span>
      </Button>

      <NFTsList
        onApplyFilters={handleApplyFilters}
        onChangePage={handleChangePage}
        filters={['type', 'price']}
        showFilters={showFilters}
        items={data?.data}
        paging={data?.paging} />
    </div>
  )
}