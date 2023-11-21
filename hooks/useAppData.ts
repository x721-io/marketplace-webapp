'use client'

import useSWR from 'swr'
import { useCallback, useEffect, useMemo } from 'react'
import useAuthStore from '@/store/auth/store'
import useAppCommonStore from '@/store/common/store'
import MarketplaceAPI from '@/services/api/marketplace'

export const useUpdateAppData = () => {
  const { setCollection } = useAppCommonStore()
  const userId = useAuthStore(state => state.profile?.id)

  const { data: collectionsData, error, isLoading } = useSWR(
    !!userId ? 'true' : null,
    () => MarketplaceAPI.fetchCollectionsByUser(userId as string),
    { refreshInterval: 3600 * 1000 }
  )

  useEffect(() => {
    if (userId && collectionsData) {
      setCollection(userId, collectionsData)
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