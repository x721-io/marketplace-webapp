import { useEffect, useState } from 'react'
import SliderIcon from '@/components/Icon/Sliders'
import Button from '@/components/Button'
import { classNames } from '@/utils/string'
import NFTsList from '@/components/List/NFTsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { useNFTFilters } from '@/hooks/useFilters'
import useSWR from 'swr'
import { sanitizeObject } from '@/utils'
import { APIParams } from '@/services/api/types'
import { Address } from 'wagmi'

export default function OnSaleNFTs({ wallet, onUpdateAmount }: {
  wallet: Address,
  onUpdateAmount: (n: number) => void
}) {
  const [showFilters, setShowFilters] = useState(false)
  const api = useMarketplaceApi()
  const { activeFilters, handleApplyFilters, handleChangePage } = useNFTFilters({
    page: 1,
    limit: 20,
    traits: undefined,
    collectionAddress: undefined,
    creatorAddress: undefined,
    owner: wallet,
    priceMax: undefined,
    priceMin: undefined,
    sellStatus: 'AskNew'
  })

  const { data, isLoading } = useSWR(
    activeFilters,
    (filters) => api.fetchNFTs(sanitizeObject(filters) as APIParams.FetchNFTs),
    { refreshInterval: 300000 }
  )

  useEffect(() => {
    if (data?.paging.total) {
      onUpdateAmount(data?.paging.total)
    }
  }, [data]);

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
        loading={isLoading}
        onApplyFilters={handleApplyFilters}
        onChangePage={handleChangePage}
        filters={['price', 'type']}
        showFilters={showFilters}
        items={data?.data}
        paging={data?.paging} />
    </div>
  )
}