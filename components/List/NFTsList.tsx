import { APIResponse } from '@/services/api/types'
import NFTFilters from '@/components/Filters/NFTFilters'
import { classNames } from '@/utils/string'
import NFTCard from '@/components/NFT/NFTCard'

interface Props {
  items?: APIResponse.NFT[]
  showFilters: boolean
}

export default function NFTsList({ items, showFilters }: Props) {

  return (
    <div className="w-full flex gap-12">
      {showFilters && <NFTFilters />}

      <div className="flex-1">
        <div className={
          classNames(
            'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 md:gap-3 transition-all',
            showFilters ? 'lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:gap-3' : 'lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 md:gap-3'
          )
        }>
          {
            Array.isArray(items) && items.map(item => (
              <NFTCard {...item} />
            ))
          }
        </div>
      </div>
    </div>
  )
}