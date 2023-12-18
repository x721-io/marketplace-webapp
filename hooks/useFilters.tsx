import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/store/ui/store'
import { APIParams } from '@/services/api/types'
import { parseEther } from 'ethers'
import { FilterKey, SearchKey } from '@/store/ui/types'

export const useExploreSectionFilters = () => {
  const pathname = usePathname()
  const { showFilters, toggleFilter } = useUIStore(state => state)

  const routeKey: FilterKey = useMemo(() => {
    switch (true) {
      case pathname.includes('collections'):
        return 'collections'
      case pathname.includes('profile'):
        return 'profile'
      case pathname.includes('items'):
      default:
        return 'nfts'
    }
  }, [pathname])

  const searchKey: SearchKey =  useMemo(() => {
    switch (true) {
      case pathname.includes('collections'):
        return 'collections'
      case pathname.includes('users'):
        return 'users'
      case pathname.includes('items'):
      default:
        return 'nfts'
    }
  }, [pathname])

  const isFiltersVisible = useMemo(() => {
    if (!routeKey) return false
    return showFilters[routeKey]
  }, [showFilters, routeKey])

  const handleToggleFilters = () => {
    if (!routeKey) return
    toggleFilter(routeKey)
  }

  return { isFiltersVisible, routeKey, handleToggleFilters, searchKey }
}

export const useNFTFilters = (defaultState?: APIParams.FetchNFTs) => {
  const [activeFilters, setActiveFilters] = useState<APIParams.FetchNFTs>(defaultState ?? {
    page: 1,
    limit: 20,
    traits: undefined,
    collectionAddress: undefined,
    creatorAddress: undefined,
    priceMax: undefined,
    priceMin: undefined,
    sellStatus: undefined,
    owner: undefined
  })

  const handleApplyFilters = ({ priceMax, priceMin, ...rest }: APIParams.FetchNFTs) => {
    const _activeFilters = {
      ...activeFilters,
      ...rest,
      page: 1,
      limit: 20
    }
    if (priceMax && Number(priceMax)) {
      _activeFilters.priceMax = parseEther(priceMax.toString()).toString()
    }
    if (priceMin && Number(priceMin)) {
      _activeFilters.priceMin = parseEther(priceMin.toString()).toString()
    }

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