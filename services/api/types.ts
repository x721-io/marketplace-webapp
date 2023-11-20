import { AxiosRequestConfig } from 'axios'

export namespace APIParams {
  interface BaseParams {
    config?: AxiosRequestConfig
  }

  export interface Connect extends BaseParams {
    date: string
    publicKey: `0x${string}`
    signature: `0x${string}`
    signer: string
  }

  export interface UpdateProfile extends BaseParams {
    acceptedTerms?: boolean
    email?: string
    username?: string
  }

  export interface UpdateCollection extends BaseParams {
    txCreationHash: string,
    name: string,
    symbol: string,
    description: string,
    type: 'ERC721' | 'ERC1155',
    categoryId?: number,
    shortUrl: string,
    metadata?: any,
    creators: string
  }
}

export namespace APIResponse {
  export interface Connect {
    accessToken: string
    accessTokenExpire: number // 1700117015092
    refreshToken: string
    refreshTokenExpire: number // 1700721515092
    userId: string
  }

  export interface Profile {
    id: string
    publicKey: string
    signDate: string
    signature: `0x${string}`
    signedMessage: string
    acceptedTerms: boolean
    avatar?: string | null
    createdAt?: string | null
    email?: null
    signer: `0x${string}`
    updatedAt?: string | null
    username?: string | null
  }

  export interface UploadImage {
    fileHashes: string[]
  }
}