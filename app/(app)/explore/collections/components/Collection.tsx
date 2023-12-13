'use client'

import CollectionsList from '@/components/List/CollectionsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { APIParams } from '@/services/api/types'
import { useState } from 'react'
import useSWR from 'swr'
import { sanitizeObject } from '@/utils'

export default function ExploreCollectionList() {
  const api = useMarketplaceApi()
  const [activePagination, setActivePagination] = useState<APIParams.FetchCollections>({
    page: 1,
    limit: 10
  })
  const { data: collections, error, isLoading } = useSWR(
    ['collections', activePagination],
    () => api.fetchCollections(sanitizeObject(activePagination) as APIParams.FetchCollections),
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