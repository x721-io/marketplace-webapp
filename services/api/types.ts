import { AxiosRequestConfig } from 'axios'
import { AssetType, Trait } from '@/types'
import { Address } from 'wagmi'

interface Creator {
  avatar: null | string
  email: string
  publicKey: string
  username: string
}

export namespace APIParams {
  export interface Connect {
    date: string
    publicKey: Address
    signature: Address
    signer: string
  }

  export interface UpdateProfile {
    acceptedTerms?: boolean
    email?: string
    username?: string
  }

  export interface UpdateCollection {
    txCreationHash: string,
    name: string,
    symbol: string,
    description: string,
    type: AssetType,
    categoryId?: number,
    shortUrl: string,
    metadata?: any,
    creators: string
  }

  export interface CreateNFT {
    id: Address
    name: string,
    ipfsHash: string,
    tokenUri: string,
    collectionId: string,
    txCreationHash: string,
    creatorId: string,
    traits?: Trait[]
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
    signature: Address
    signer: Address
    signedMessage: string
    acceptedTerms: boolean
    avatar?: string | null
    createdAt?: string | null
    email?: null
    updatedAt?: string | null
    username?: string | null
  }

  export interface UploadImage {
    fileHashes: string[]
  }

  export interface Collection {
    id: string
    txCreationHash: string
    name: string | null
    symbol: string
    address: string
    description?: string | null
    categoryId: number | null
    createdAt: string
    updatedAt: string
    metadata: null | Record<string, any> | any[]
    shortUrl: string | null
    status: 'PENDING' | 'SUCCESS' | 'FAILED'
    type: AssetType
    creators: Creator[]
  }

  export interface CreateNFT {
    tokenId: string
  }
}