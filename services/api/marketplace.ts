import { marketplaceApi } from '@/services/api/index'
import { API_ENDPOINTS } from '@/config/api'
import { APIParams, APIResponse } from '@/services/api/types'

export default class MarketplaceAPI {
  /** POST **/
  static connect = ({ config, ...params }: APIParams.Connect): Promise<APIResponse.Connect> => marketplaceApi.post(API_ENDPOINTS.CONNECT, params, config)
  static updateProfile = ({ config, ...params }: APIParams.UpdateProfile) => marketplaceApi.post(API_ENDPOINTS.PROFILE, params, config)

  /** GET **/
  static viewProfile = (wallet: `0x${string}`): Promise<APIResponse.Profile> => marketplaceApi.get(API_ENDPOINTS.PROFILE + `/${wallet}`)

}