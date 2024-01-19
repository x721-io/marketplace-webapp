import CollectionsList from '@/components/List/CollectionsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserCollections({ onUpdateAmount, userId }: {
  onUpdateAmount: (n: number) => void
  userId: string
}) {
  const { id } = useParams()
  const api = useMarketplaceApi()

  const [activePagination, setActivePagination] = useState({
    page: 1,
    limit: 1000
  })

  const { data: collections, isLoading } = useSWR(
    !!id ? { ...activePagination, userId: String(id), hasBase: false } : null,
    (params) => api.fetchCollectionsByUser(params),
    { refreshInterval: 300000 }
  )

  const handleChangePage = (page: number) => {
    setActivePagination({
      ...activePagination,
      page
    })
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (collections?.paging.total) {
      onUpdateAmount(collections?.paging.total)
    }
  }, [collections]);

  return (
    <div className="w-full py-7 overflow-x-auto">
      <CollectionsList
        loading={isLoading}
        collections={collections?.data}
        paging={collections?.paging}
        onChangePage={handleChangePage}
        id={id} 
        showCreateCollection={true}
        creator={userId}/>
    </div>
  )
}