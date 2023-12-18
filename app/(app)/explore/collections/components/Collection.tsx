'use client'

import CollectionsList from '@/components/List/CollectionsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { APIParams } from '@/services/api/types'
import { useState } from 'react'
import useSWR from 'swr'
import { sanitizeObject } from '@/utils'
import { useUIStore } from '@/store/ui/store'
import { useExploreSectionFilters } from '@/hooks/useFilters'

export default function ExploreCollectionList() {
  const api = useMarketplaceApi()

  const [activePagination, setActivePagination] = useState({
    page: 1,
    limit: 10
  })
  const { queryString } = useUIStore(state => state)
  const { searchKey } = useExploreSectionFilters()

  const { data: collections, error, isLoading } = useSWR(
    { ...activePagination, name: queryString[searchKey] },
    (params) => api.fetchCollections(sanitizeObject(params) as APIParams.FetchCollections),
    { refreshInterval: 30000 }
  )

  const handleChangePage = (page: number) => {
    setActivePagination({
      ...activePagination,
      page
    })
  }

  return <CollectionsList
    collections={collections?.data}
    paging={collections?.paging}
    onChangePage={handleChangePage}
  />
}