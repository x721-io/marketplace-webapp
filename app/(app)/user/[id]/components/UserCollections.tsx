import CollectionsList from '@/components/List/CollectionsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { sanitizeObject } from '@/utils'
import { useState } from 'react'
import { APIParams } from '@/services/api/types'

export default function UserCollections() {
  const { id } = useParams()
  const api = useMarketplaceApi()

  const [activePagination, setActivePagination] = useState<APIParams.FetchCollectionById>({
    page: 1,
    limit: 1000
  })

  const { data: collections } = useSWR(
    [id, activePagination],
    ([id, params]) => api.fetchCollectionsByUser(id as string, sanitizeObject(params) as APIParams.FetchCollectionById, false),
    { refreshInterval: 30000 }
  )

  const handleChangePage = (page: number) => {
    setActivePagination({
      ...activePagination,
      page
    })
  }

  return (
    <div className="w-full py-7 overflow-x-auto">
      <CollectionsList
        collections={collections?.data}
        paging={collections?.paging}
        onChangePage={handleChangePage}
        id={id} />
    </div>
  )
}