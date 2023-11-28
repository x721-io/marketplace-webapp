import { AssetType, Trait } from '@/types'
import { Address } from 'wagmi'
import { BigNumberish } from 'ethers'

type Status = 'PENDING' | 'SUCCESS' | 'FAILED'
type MarketEventType = 'AskNew' | 'AskCancel' | 'Trade' | 'AcceptBid' | 'Bid' | 'CancelBid'

export interface MarketEvent {
  id: string,
  event: MarketEventType
  nftId: {
    id: string
    contract: {
      id: Address
      name: string
    }
  },
  price: BigNumberish
  to: string
  from: string
  quoteToken: Address
  operationId: string
  amounts: string
  timestamp: BigNumberish
}

export namespace APIParams {
  interface PaginationParams {
    page: number
    limit: number
  }

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
    imageHash: string,
    tokenUri: string,
    collectionId: string,
    txCreationHash: string,
    creatorId: string,
    traits?: Trait[]
  }

  export interface GetUsers {
    limit: string
  }

  export interface SearchNFT extends PaginationParams {
    traits?: { trait_type: string, value: any }[]
    collectionAddress?: Address,
    creatorAddress?: Address,
    priceMax?: BigNumberish,
    priceMin?: BigNumberish,
    sellStatus?: MarketEventType
  }

  export interface NFTEvents extends PaginationParams {
    nftId?: string,
    type?: AssetType,
    from?: string,
    to?: string,
    quoteToken?: Address,
    event?: MarketEventType
  }
}

export namespace APIResponse {
  interface Pagination {
    page: number
    limit: number
    total: number
  }

  export interface Connect {
    accessToken: string
    accessTokenExpire: number // 1700117015092
    refreshToken: string
    refreshTokenExpire: number // 1700721515092
    userId: string
  }

  export interface Profile {
    id: string
    publicKey: Address
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
    fileHashes: string[],
    metadataHash: string
  }

  export interface Collection {
    id: string
    txCreationHash: string
    name: string | null
    symbol: string
    address: Address
    description?: string | null
    categoryId: number | null
    createdAt: string
    updatedAt: string
    metadata: null | Record<string, any> | any[]
    shortUrl: string | null
    status: Status
    type: AssetType
    creators: User[]
  }

  export interface CreateNFT {
    tokenId: string
  }

  export interface NFT {
    id: string
    name: string
    ipfsHash: string
    createdAt: string
    updatedAt: string
    status: Status,
    tokenUri: string,
    txCreationHash: string,
    creatorId: string,
    collectionId: string,
    creator: {
      avatar: null | string
      email: string | null
      id: string
      publicKey: Address
      username: string
    },
    owners: {
      nftId: string
      quantity: number
      userId: string
      user: Omit<User, 'id'>
    }[],
    collection: Collection,
    traits: Trait[]
    sellInfo?: {
      marketEvent1155S: MarketEvent[],
      marketEvent721S: MarketEvent[]
    }
  }

  export interface SearchNFT {
    data: NFT[]
    paging: Pagination
  }

  export interface User {
    id: string
    email: string
    avatar: string | null
    username: string | null
    signature: Address
    signedMessage: string
    signer: Address
    publicKey: string
    signDate: string
    acceptedTerms: boolean
    createdAt: string
    updatedAt?: string | null
  }

  export type NFTEvents = MarketEvent[]
}