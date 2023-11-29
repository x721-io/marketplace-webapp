import useAuthStore from '@/store/auth/store'
import { APIParams, APIResponse } from '@/services/api/types'
import { marketplaceApi } from '@/services/api'
import { API_ENDPOINTS } from '@/config/api'
import { Address } from 'wagmi'
import { useMemo } from 'react'

export const useMarketplaceApi = () => {
  const { credentials } = useAuthStore()
  const bearerToken = credentials?.accessToken
  const authHeader = useMemo(
    () => ({ headers: { 'Authorization': `Bearer ${bearerToken}` } }),
    [bearerToken]
  )

  return useMemo(() => {
    return {
      connect: (params: APIParams.Connect): Promise<APIResponse.Connect> => marketplaceApi.post(API_ENDPOINTS.CONNECT, params),

      updateProfile: (params: APIParams.UpdateProfile) => marketplaceApi.post(API_ENDPOINTS.PROFILE, params, authHeader),

      uploadFile: (files: Blob[] | Blob, metadata?: Record<string, any>): Promise<APIResponse.UploadImage> => {
        const form = new FormData();
        if (Array.isArray(files)) {
          files.forEach(file => {
            form.append('files', file)
          })
        } else {
          form.append("files", files, (files as any).name)
        }
        if (metadata) {
          form.append('metadata', JSON.stringify(metadata))
        }
        return marketplaceApi.post(API_ENDPOINTS.UPLOAD_IMAGE, form)
      },

      updateCollection: (params: APIParams.UpdateCollection) => marketplaceApi.post(API_ENDPOINTS.COLLECTIONS, params, authHeader),

      createNFT: (params: APIParams.CreateNFT): Promise<APIResponse.CreateNFT> => marketplaceApi.post(API_ENDPOINTS.NFT, params, authHeader),

      fetchNFTs: (params: APIParams.SearchNFT): Promise<APIResponse.SearchNFT> => marketplaceApi.post(API_ENDPOINTS.SEARCH_NFT, params),

      fetchNFTEvents: (params: APIParams.NFTEvents): Promise<APIResponse.NFTEvents> => marketplaceApi.post(API_ENDPOINTS.NFT_EVENTS, params),

      /** GET **/
      generateTokenId: async (collectionAddress: Address): Promise<string> => {
        const idHash: number = await marketplaceApi.get(API_ENDPOINTS.TOKEN_ID + `?collectionAddress=${collectionAddress}`, authHeader)
        return BigInt(idHash).toString()
      },

      fetchCollections: (): Promise<APIResponse.Collection[]> => marketplaceApi.get(API_ENDPOINTS.COLLECTIONS),

      fetchCollectionsByUser: async (userId: string): Promise<APIResponse.Collection[]> => {
        const data: any = await marketplaceApi.get(API_ENDPOINTS.USER_COLLECTIONS + `/${userId}`)
        return (data && data[0]) ? data[0]['nftCollection'].map((item: any) => item.collection) as APIResponse.Collection[] : []
      },

      fetchNFTById: (id: string, bidListPage: number = 1, bidListLimit: number = 100): Promise<APIResponse.NFT> => {
        return marketplaceApi.get(API_ENDPOINTS.NFT + `/${id}?bidListPage=${bidListPage}&bidListLimit=${bidListLimit}`)
      },

      viewProfile: (id: Address | string): Promise<APIResponse.Profile> => marketplaceApi.get(API_ENDPOINTS.PROFILE + `/${id}`),

      fetchUsers: async ({ limit }: APIParams.FetchUsers): Promise<APIResponse.User[]> => {
        const res = await marketplaceApi.get(API_ENDPOINTS.USER + `?limit=${limit}`)
        return (res as any).users
      }
    }
  }, [authHeader])
}