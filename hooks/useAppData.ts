'use client'

import useSWR from 'swr'
import { useCallback, useEffect, useMemo } from 'react'
import useAuthStore from '@/store/auth/store'
import useAppCommonStore from '@/store/common/store'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'

export const useUpdateAppData = () => {
  const api = useMarketplaceApi()
  const { setCollection } = useAppCommonStore()
  const userId = useAuthStore(state => state.profile?.id)

  const { data: collectionsData, error, isLoading } = useSWR(
    !!userId ? 'true' : null,
    () => api.fetchCollectionsByUser(userId as string,{ page: 1, limit: 10 }, true),
    { refreshInterval: 3600 * 1000 }
  )

  useEffect(() => {
    if (userId && collectionsData) {
      setCollection(userId, collectionsData?.data)
    }
  }, [userId, collectionsData])
}

export const useAppCommonData = () => {
  const userId = useAuthStore(state => state.profile?.id)
  const { collections } = useAppCommonStore()

  const myCollections = useMemo(() => {
    if (!userId) return []
    return collections[userId] ?? []
  }, [collections, userId])

  const getUserCollections = useCallback((id: string) => {
    if (!id) {
      return undefined
    }
    return collections[id]
  }, [collections, userId])

  return {
    collections,
    getUserCollections,
    myCollections
  }
}