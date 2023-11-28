import { APIResponse } from '@/services/api/types'
import NFTFilters, { FilterType } from '@/components/Filters/NFTFilters'
import { classNames } from '@/utils/string'
import NFTCard from '@/components/NFT/NFTCard'
import { Pagination } from 'flowbite-react'
import { useMemo } from 'react'

interface Paging {
  page?: number
  limit: number
  total?: number
}

interface Props {
  items?: APIResponse.NFT[]
  showFilters: boolean
  filters?: FilterType[]
  onApplyFilters: (filters: Record<string, any>) => void
  onChangePage: (page: number) => void
  paging?: Paging
}

export default function NFTsList({ items, showFilters, filters, onApplyFilters, paging, onChangePage }: Props) {
  const totalPage = useMemo(() => {
    if (!paging?.total) return 0
    return Math.ceil(paging.total / paging.limit)
  }, [paging])

  return (
    <div className="w-full">
      <div className="w-full flex gap-12 mb-7">
        {showFilters && <NFTFilters filters={filters} onApplyFilters={onApplyFilters} />}

        <div className="flex-1">
          <div className={
            classNames(
              'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 md:gap-3 transition-all',
              showFilters ? 'lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:gap-3' : 'lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 md:gap-3'
            )
          }>
            {
              Array.isArray(items) && items.map(item => (
                <div key={item.id}>
                  <NFTCard {...item} />
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Pagination currentPage={paging?.page ?? 1} totalPages={totalPage} onPageChange={onChangePage} />
      </div>
    </div>
  )
}