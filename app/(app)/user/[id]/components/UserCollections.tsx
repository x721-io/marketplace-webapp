import CollectionsList from '@/components/List/CollectionsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function UserCollections() {
  const { id } = useParams()
  const api = useMarketplaceApi()

  const [activePagination, setActivePagination] = useState({
    page: 1,
    limit: 1000
  })

  const { data: collections } = useSWR(
    !!id ? { ...activePagination, userId: String(id), hasBase: false } : null,
    (params) => api.fetchCollectionsByUser(params),
    { refreshInterval: 30000 }
  )

  const handleChangePage = (page: number) => {
    setActivePagination({
      ...activePagination,
      page
    })
    window.scrollTo(0, 0)
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