import { APIParams, APIResponse } from '@/services/api/types'
import NFTFilters, { FilterType } from '@/components/Filters/NFTFilters'
import { classNames } from '@/utils/string'
import NFTCard from '@/components/NFT/NFTCard'
import { Pagination, Spinner } from 'flowbite-react'
import React, { useCallback, useMemo } from 'react'
import Text from '@/components/Text'
import MobileFiltersModal from '@/components/Modal/MobileFiltersModal'
import { isMobile } from 'react-device-detect'
import { NFT } from '@/types'

interface Paging {
  page?: number
  limit: number
  total?: number
}

interface Props {
  items?: NFT[]
  showFilters: boolean
  filters?: FilterType[]
  onApplyFilters: (filtersParams: APIParams.FetchNFTs) => void
  onChangePage: (page: number) => void
  paging?: Paging
  traitFilters?: APIResponse.CollectionDetails['traitAvailable']
  onClose?: () => void // For mobile only: Close modal filters
  loading?: boolean
  error?: boolean
}

export default function NFTsList({
  items,
  showFilters,
  filters,
  onApplyFilters,
  paging,
  traitFilters,
  onChangePage,
  onClose,
  loading,
  error
}: Props) {
  const totalPage = useMemo(() => {
    if (!paging?.total) return 0
    return Math.ceil(paging.total / paging.limit)
  }, [paging])

  const renderList = useCallback(() => {
    if (loading) {
      return (
        <div className="w-full h-56 flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      )
    }

    if (error && !items) {
      return (
        <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
          <Text variant="heading-xs" className="text-center">
            Network Error!
            <br />
            Please try again later
          </Text>
        </div>
      )
    }

    if (!items?.length) {
      return (
        <div className="w-full h-[295px] flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
          <Text className="text-secondary font-semibold text-body-18">Nothing to show</Text>
        </div>
      )
    }
    return (
      <div className="flex-1">
        <div className={
          classNames(
            'grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:gap-3 tablet:gap-4 gap-3',
            isMobile ? 'desktop:grid-cols-6 tablet:grid-cols-3 grid-cols-2' : (showFilters ? 'desktop:grid-cols-4 tablet:grid-cols-2 grid-cols-1' : 'desktop:grid-cols-6 tablet:grid-cols-3 grid-cols-2')
          )}>
          {items.map(item => (
            <div className="h-full" key={item.collection.address + '-' + item.u2uId}>
              <NFTCard {...item} />
            </div>
          ))}
        </div>
      </div>
    )
  }, [items, loading, error])

  return (
    <div className="w-full">
      <div className={classNames(
        'w-full flex gap-12 mb-7',
        showFilters ? 'flex-col tablet:flex-row desktop:flex-row tablet:items-start' : 'flex-row'
      )}>
        {
          isMobile ? (
              <MobileFiltersModal
                show={showFilters}
                onClose={onClose}
                baseFilters={filters}
                onApplyFilters={onApplyFilters}
                traitsFilter={traitFilters}
              />
            ) :
            showFilters && (
              <NFTFilters
                baseFilters={filters}
                onApplyFilters={onApplyFilters}
                traitsFilter={traitFilters} />
            )
        }

        {renderList()}
      </div>
      {items?.length ? <div className="flex justify-end">
          <Pagination currentPage={paging?.page ?? 1} totalPages={totalPage} onPageChange={onChangePage} />
      </div> : ""}

    </div>
  )
}