import useAuthStore from '@/store/auth/store'
import { APIParams, APIResponse } from '@/services/api/types'
import { marketplaceApi } from '@/services/api'
import { API_ENDPOINTS } from '@/config/api'
import { Address } from 'wagmi'
import { useMemo } from 'react'
import { getMetaDataHash } from '@/utils/nft'

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

      updateProfile: (params: APIParams.UpdateProfile): Promise<APIResponse.Profile> => marketplaceApi.post(API_ENDPOINTS.PROFILE, params, authHeader),

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

      uploadMetadata: (data: Record<string, any>): Promise<APIResponse.UploadMetadata> => {
        const form = new FormData();
        form.append('metadata', JSON.stringify(data))
        return marketplaceApi.post(API_ENDPOINTS.UPLOAD_IMAGE, form)
      },

      createCollection: (params: APIParams.CreateCollection) => marketplaceApi.post(API_ENDPOINTS.COLLECTIONS, params, authHeader),

      updateCollection: (params: APIParams.UpdateCollection) => marketplaceApi.put(API_ENDPOINTS.COLLECTIONS, params, authHeader),

      createNFT: (params: APIParams.CreateNFT): Promise<APIResponse.CreateNFT> => marketplaceApi.post(API_ENDPOINTS.NFT, params, authHeader),

      fetchNFTs: (params: APIParams.FetchNFTs): Promise<APIResponse.FetchNFTs> => marketplaceApi.post(API_ENDPOINTS.SEARCH_NFT, params),

      fetchNFTEvents: (params: APIParams.NFTEvents): Promise<APIResponse.NFTEvents> => marketplaceApi.post(API_ENDPOINTS.NFT_EVENTS, params),

      search: (params: APIParams.Search): Promise<any> => marketplaceApi.post(API_ENDPOINTS.SEARCH, params),

      searchNFTs: (text: string): Promise<APIResponse.SearchNFTs> => marketplaceApi.post(API_ENDPOINTS.SEARCH, {
        mode: 'NFT',
        text
      }),

      searchCollections: (text: string): Promise<APIResponse.SearchCollections> => marketplaceApi.post(API_ENDPOINTS.SEARCH, {
        mode: 'COLLECTION',
        text
      }),

      searchUsers: (text: string): Promise<APIResponse.SearchUsers> => marketplaceApi.post(API_ENDPOINTS.SEARCH, {
        mode: 'USER',
        text
      }),

      validateInput: (params: APIParams.ValidateInput): Promise<boolean> => marketplaceApi.post(API_ENDPOINTS.VALIDATE_INPUT, params),

      /** GET **/
      fetchCollections: (): Promise<APIResponse.CollectionsData> => marketplaceApi.get(API_ENDPOINTS.COLLECTIONS),

      fetchCollectionById: (id: string | Address): Promise<APIResponse.CollectionDetails> => marketplaceApi.get(API_ENDPOINTS.COLLECTIONS + `/${id}`),

      fetchCollectionsByUser: async (userId: string): Promise<APIResponse.Collection[]> => {
        const data: any = await marketplaceApi.get(API_ENDPOINTS.USER_COLLECTIONS + `/${userId}`)
        return (data && data[0]) ? data[0]['nftCollection'].map((item: any) => item.collection) as APIResponse.Collection[] : []
      },

      generateTokenId: async (collectionAddress: Address): Promise<APIResponse.GenerateTokenId> => marketplaceApi.get(API_ENDPOINTS.TOKEN_ID + `?collectionAddress=${collectionAddress}`, authHeader),

      fetchNFTById: (collectionAddress: string, id: string, bidListPage: number = 1, bidListLimit: number = 100): Promise<APIResponse.NFT> => {
        return marketplaceApi.get(API_ENDPOINTS.NFT + `?collectionAddress=${collectionAddress}&id=${id}?bidListPage=${bidListPage}&bidListLimit=${bidListLimit}`)
      },

      getNFTMetaData: (ifpsUrl: string): Promise<APIResponse.NFTMetaData> => {
        const hash = getMetaDataHash(ifpsUrl)
        return marketplaceApi.get(API_ENDPOINTS.GET_METADATA + `?hash=${hash}`)
      },

      viewProfile: (id: Address | string): Promise<APIResponse.Profile> => marketplaceApi.get(API_ENDPOINTS.PROFILE + `/${id}`),

      fetchUsers: async ({ limit }: APIParams.FetchUsers): Promise<APIResponse.User[]> => {
        const res = await marketplaceApi.get(API_ENDPOINTS.USER + `?limit=${limit}`)
        return (res as any).users
      }
    }
  }, [authHeader])
}