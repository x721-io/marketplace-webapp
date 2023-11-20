import { marketplaceApi } from '@/services/api/index'
import { API_ENDPOINTS } from '@/config/api'
import { APIParams, APIResponse } from '@/services/api/types'

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
    form.append("files", file, file.name)
    return marketplaceApi.post(API_ENDPOINTS.UPLOAD_IMAGE, form)
  }
  static updateCollection = ({
    config,
    ...params
  }: APIParams.UpdateCollection) => marketplaceApi.post(API_ENDPOINTS.COLLECTION, params, config)

  /** GET **/
  static fetchCollections = () => marketplaceApi.post(API_ENDPOINTS.COLLECTION)
  static viewProfile = (wallet: `0x${string}`): Promise<APIResponse.Profile> => marketplaceApi.get(API_ENDPOINTS.PROFILE + `/${wallet}`)
}