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
      <div className={
        classNames('w-full flex gap-12 mb-7', showFilters ? 'flex-col tablet:flex-row desktop:flex-row' : 'flex-row')
      }>
        {showFilters && <NFTFilters filters={filters} onApplyFilters={onApplyFilters} />}

        <div className="flex-1">
          <div className={
            classNames(
              'grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:gap-3 tablet:gap-4 gap-3 grid-cols-2',
              showFilters ? 'desktop:grid-cols-4 tablet:grid-cols-2' : 'desktop:grid-cols-6 tablet:grid-cols-3'
            )}>
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