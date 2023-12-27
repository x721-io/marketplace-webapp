import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/store/ui/store'
import { APIParams } from '@/services/api/types'
import { parseEther } from 'ethers'
import { FilterKey, SearchKey } from '@/store/ui/types'
import { sanitizeObject } from '@/utils'

export const useExploreSectionFilters = () => {
  const pathname = usePathname()
  const { showFilters, toggleFilter, queryString, setQueryString } = useUIStore(state => state)

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

  const searchKey: SearchKey = useMemo(() => {
    switch (true) {
      case pathname.includes('collection'):
        return 'collection'
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

  const query = useMemo(() => queryString[searchKey], [queryString, searchKey])

  return { isFiltersVisible, routeKey, handleToggleFilters, searchKey, query, setQueryString }
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

  const handleApplyFilters = (params: APIParams.FetchNFTs) => {
    const _activeFilters = sanitizeObject({
      ...activeFilters,
      ...params,
      page: 1,
      limit: 20
    })
    if (params.priceMax && !isNaN(Number(params.priceMax))) {
      _activeFilters.priceMax = parseEther(params.priceMax.toString()).toString()
    }
    if (params.priceMin && !isNaN(Number(params.priceMin))) {
      _activeFilters.priceMin = parseEther(params.priceMin.toString()).toString()
    }

    setActiveFilters(_activeFilters)
  }

  const handleChangePage = (page: number) => {
    setActiveFilters({
      ...activeFilters,
      page
    })
    window.scrollTo(0, 0)
  }

  return {
    activeFilters,
    handleChangePage,
    handleApplyFilters
  }
}

export const useCollectionFilters = (defaultState?: APIParams.FetchCollections) => {
  const [activeFilters, setActiveFilters] = useState<APIParams.FetchCollections>(defaultState ?? {
    page: 1,
    limit: 20,
    max: '',
    min: ''
  })

  const handleChangePage = (page: number) => {
    setActiveFilters({
      ...activeFilters,
      page
    })
    window.scrollTo(0, 0)
  }

  const handleApplyFilters = (params: APIParams.FetchCollections) => {
    const _activeFilters = sanitizeObject({
      ...activeFilters,
      ...params,
      page: 1,
      limit: 20
    })

    if (params.max && !isNaN(Number(params.max))) {
      _activeFilters.max = parseEther(params.max.toString()).toString()
    }
    if (params.min && !isNaN(Number(params.min))) {
      _activeFilters.min = parseEther(params.min.toString()).toString()
    }

    setActiveFilters(_activeFilters)
  }

  return {
    activeFilters,
    handleChangePage,
    handleApplyFilters
  }
}