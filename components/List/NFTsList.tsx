import { APIResponse } from '@/services/api/types'
import NFTFilters, { FilterType } from '@/components/Filters/NFTFilters'
import { classNames } from '@/utils/string'
import NFTCard from '@/components/NFT/NFTCard'

interface Props {
  items?: APIResponse.NFT[]
  showFilters: boolean
  filters?: FilterType[]
  onApplyFilters?: (filters: Record<string, any>) => void
}

export default function NFTsList({ items, showFilters, filters, onApplyFilters }: Props) {
  return (
    <div className="w-full flex gap-12">
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
  )
}