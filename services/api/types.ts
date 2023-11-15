import { AxiosRequestConfig } from 'axios'

export namespace ApiParams {
  interface BaseParams {
    config?: AxiosRequestConfig
    proxy?: boolean // If true => connect to NextJS proxy Api
  }

  export interface Connect extends BaseParams {
    date: string
    publicKey: `0x${string}`
    signature: `0x${string}`
    signer: string
  }

  export interface UpdateProfile extends BaseParams {
    username?: string
    email?: string
  }
}