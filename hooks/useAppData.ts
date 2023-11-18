import useSWR from 'swr'
import { marketplaceApi } from '@/services/api'
import { API_ENDPOINTS } from '@/config/api'

export const useAppCommonData = () => {
  const { data: collections, error, isLoading } = useSWR(API_ENDPOINTS.COLLECTION, marketplaceApi.get)

  return {
    collections,
    error,
    isLoading
  }
}