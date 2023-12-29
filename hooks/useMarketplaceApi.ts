import useAuthStore from '@/store/auth/store'
import { APIParams, APIResponse } from '@/services/api/types'
import { marketplaceApi } from '@/services/api'
import { API_ENDPOINTS } from '@/config/api'
import { Address } from 'wagmi'
import { useMemo } from 'react'
import { parseQueries } from '@/utils'

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

      updateProfile: (params: APIParams.UpdateProfile): Promise<APIResponse.ProfileDetails> => marketplaceApi.post(API_ENDPOINTS.PROFILE, params, authHeader),

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

      updateCollection: ({
        coverImage,
        id
      }: APIParams.UpdateCollection) => marketplaceApi.put(API_ENDPOINTS.COLLECTIONS + `/${id}`, { coverImage }, authHeader),

      createNFT: (params: APIParams.CreateNFT): Promise<APIResponse.CreateNFT> => marketplaceApi.post(API_ENDPOINTS.NFT, params, authHeader),

      fetchNFTs: (params: APIParams.FetchNFTs): Promise<APIResponse.FetchNFTs> => marketplaceApi.post(API_ENDPOINTS.SEARCH_NFT, params),

      fetchNFTEvents: (params: APIParams.NFTEvents): Promise<APIResponse.NFTEvents> => marketplaceApi.post(API_ENDPOINTS.NFT_EVENTS, params),

      fetchUserActivities: (params: APIParams.UserActivities): Promise<APIResponse.UserActivities> => marketplaceApi.post(API_ENDPOINTS.USER_ACTIVITIES, params),

      validateInput: (params: APIParams.ValidateInput): Promise<boolean> => marketplaceApi.post(API_ENDPOINTS.VALIDATE_INPUT, params),

      /** GET **/
      fetchCollections: (params: APIParams.FetchCollections): Promise<APIResponse.CollectionsData> => marketplaceApi.get(API_ENDPOINTS.COLLECTIONS + parseQueries(params)),

      fetchCollectionById: (id: string | Address): Promise<APIResponse.CollectionDetails> => marketplaceApi.get(API_ENDPOINTS.COLLECTIONS + `/${id}`),

      fetchCollectionsByUser: async ({
        userId,
        ...rest
      }: APIParams.FetchCollectionById): Promise<APIResponse.CollectionsData> => {
        return marketplaceApi.get(API_ENDPOINTS.USER_COLLECTIONS + `/${userId}` + parseQueries(rest))
      },

      generateTokenId: async (collectionAddress: Address): Promise<APIResponse.GenerateTokenId> => marketplaceApi.get(API_ENDPOINTS.TOKEN_ID + `?collectionAddress=${collectionAddress}`, authHeader),

      fetchNFTById: (params: APIParams.FetchNFTDetails): Promise<APIResponse.NFTDetails> => {
        return marketplaceApi.get(API_ENDPOINTS.NFT + parseQueries(params))
      },

      fetchMarketDataByNFT: (params: APIParams.FetchNFTMarketData): Promise<APIResponse.NFTMarketData> => marketplaceApi.get(API_ENDPOINTS.NFT_TRANSACTIONS + parseQueries(params)),

      getNFTMetaData: (ifpsUrl: string): Promise<APIResponse.FetchNFTMetadata> => {
        return marketplaceApi.get(API_ENDPOINTS.GET_METADATA + `?ipfsPath=${ifpsUrl}`)
      },

      viewProfile: (id: Address | string): Promise<APIResponse.ProfileDetails> => marketplaceApi.get(API_ENDPOINTS.PROFILE + `/${id}`),

      fetchUsers: async (params: APIParams.FetchUsers): Promise<APIResponse.UsersData> => marketplaceApi.get(API_ENDPOINTS.USER + parseQueries(params))
    }
  }, [authHeader])
}