import { useState } from 'react'
import SliderIcon from '@/components/Icon/Sliders'
import Button from '@/components/Button'
import { classNames } from '@/utils/string'
import NFTsList from '@/components/List/NFTsList'

export default function OnSaleNFTs() {
  const [showFilters, setShowFilters] = useState(false)

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

      <NFTsList showFilters={showFilters} items={[]} />
    </div>
  )
}