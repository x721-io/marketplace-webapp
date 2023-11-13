import { proxyApi, marketplaceApi } from '@/services/api/index'
import { API_ENDPOINTS } from '@/config/api'
import { ApiParams } from '@/services/api/types'

export default class API {
  static getApiInstance = (proxy?: boolean) => proxy ? proxyApi : marketplaceApi
  static connect = ({ proxy, ...rest }: ApiParams.Connect) => this.getApiInstance(proxy).post(API_ENDPOINTS.CONNECT, { params: rest })
  static updateProfile = ({ proxy, ...rest }: ApiParams.UpdateProfile) => this.getApiInstance(proxy).post(API_ENDPOINTS.PROFILE, { params: rest })
}