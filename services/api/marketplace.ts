import { marketplaceApi } from '@/services/api/index'
import { API_ENDPOINTS } from '@/config/api'
import { APIParams, APIResponse } from '@/services/api/types'
import { Address } from 'wagmi'

export default class MarketplaceAPI {
  /** POST **/
  static connect = ({
    config,
    ...params
  }: APIParams.Connect): Promise<APIResponse.Connect> => marketplaceApi.post(API_ENDPOINTS.CONNECT, params, config)

  static updateProfile = ({
    config,
    ...params
  }: APIParams.UpdateProfile) => marketplaceApi.post(API_ENDPOINTS.PROFILE, params, config)

  static uploadFile = (file: Blob): Promise<APIResponse.UploadImage> => {
    const form = new FormData();
    form.append("files", file, (file as any).name)
    return marketplaceApi.post(API_ENDPOINTS.UPLOAD_IMAGE, form)
  }

  static updateCollection = ({
    config,
    ...params
  }: APIParams.UpdateCollection) => marketplaceApi.post(API_ENDPOINTS.COLLECTIONS, params, config)

  static createNFT = ({ config, ...params }: APIParams.CreateNFT): Promise<APIResponse.CreateNFT> => marketplaceApi.post(API_ENDPOINTS.NFT, params, config)

  /** GET **/
  static generateTokenId = ({ config, collectionAddress }: APIParams.GenerateTokenId): Promise<{ tokenId: string }> =>
    marketplaceApi.get(API_ENDPOINTS.TOKEN_ID + `?collectionAddress=${collectionAddress}`, config)

  static fetchCollections = (): Promise<APIResponse.Collection[]> => marketplaceApi.get(API_ENDPOINTS.COLLECTIONS)

  static fetchCollectionsByUser = async (userId: string): Promise<APIResponse.Collection[]> => {
    const data: any = await marketplaceApi.get(API_ENDPOINTS.USER_COLLECTIONS + `/${userId}`)
    return (data && data[0]) ? data[0]['nftCollection'].map((item: any) => item.collection) as APIResponse.Collection[] : []
  }

  static viewProfile = (wallet: Address): Promise<APIResponse.Profile> => marketplaceApi.get(API_ENDPOINTS.PROFILE + `/${wallet}`)
}