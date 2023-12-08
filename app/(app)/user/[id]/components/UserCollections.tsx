import CollectionsList from '@/components/List/CollectionsList'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useParams } from 'next/navigation'

export default function UserCollections() {
  const { id } = useParams()
  const api = useMarketplaceApi()
  const { data: collections } = useSWR('user-collections', () => api.fetchCollectionsByUser(id as string), {
    refreshInterval: 300000
  })

  return (
    <div className="w-full py-7 overflow-x-auto">
      <CollectionsList collections={collections} />
    </div>
  )
}