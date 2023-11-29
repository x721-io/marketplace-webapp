import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/store/ui/store'
import { APIParams } from '@/services/api/types'
import { parseEther } from 'ethers'

export const useExploreSectionFilters = () => {
  const pathname = usePathname()
  const { showFilters, toggleFilter } = useUIStore(state => state)

  const routeKey = useMemo(() => {
    switch (true) {
      case pathname.includes('collections'):
        return 'collections'
      case pathname.includes('items'):
        return 'nfts'
      case pathname.includes('profile'):
        return 'profile'
    }
  }, [pathname])

  const isFiltersVisible = useMemo(() => {
    if (!routeKey) return false
    return showFilters[routeKey]
  }, [showFilters, routeKey])

  return { isFiltersVisible }
}

export const useNFTFilters = (defaultState?: APIParams.SearchNFT) => {
  const [activeFilters, setActiveFilters] = useState<APIParams.SearchNFT>(defaultState ?? {
    page: 1,
    limit: 20,
    traits: undefined,
    collectionAddress: undefined,
    creatorAddress: undefined,
    priceMax: undefined,
    priceMin: undefined,
    sellStatus: undefined
  })

  const handleApplyFilters = ({ type, sellStatus, priceMax, priceMin }: Record<string, any>) => {
    const _activeFilters = {
      ...activeFilters,
      page: 1,
      limit: 20,
      type,
      sellStatus
    }
    if (Number(priceMax)) _activeFilters.priceMax = parseEther(priceMax).toString()
    if (Number(priceMin)) _activeFilters.priceMin = parseEther(priceMin).toString()

    setActiveFilters(_activeFilters)
  }

  const handleChangePage = (page: number) => {
    setActiveFilters({
      ...activeFilters,
      page
    })
  }

  return {
    activeFilters,
    handleChangePage,
    handleApplyFilters
  }
}