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
  to: Address
  from: Address
  quoteToken: Address
  operationId: string
  amounts: string
  timestamp: number
}

export namespace APIParams {
  interface PaginationParams {
    page?: number
    limit?: number
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
    bio?: string
    facebookLink?: string
    twitterLink?: string
    telegramLink?: string
    discordLink?: string
    webURL?: string
    coverImage?: string
    avatar?: string
    shortLink?: string
  }

  export interface UpdateCollection {
    coverImage: string
    id: string
  }

  export interface CreateCollection {
    txCreationHash: Address
    name: string,
    symbol: string,
    description: string,
    type: AssetType,
    categoryId?: number,
    shortUrl: string,
    metadata?: any,
    creators: string,
    avatar?: string,
  }

  export interface CreateNFT {
    id: string
    u2uId: string
    name: string,
    ipfsHash: string,
    // image: string,
    tokenUri: string,
    collectionId: string,
    txCreationHash: string,
    creatorId: string,
    traits?: string
  }

  export interface FetchUsers extends PaginationParams {

  }

  export interface FetchCollections extends PaginationParams {

  }

  export interface FetchNFTs extends PaginationParams {
    traits?: { trait_type: string, value: any }[]
    type?: AssetType
    collectionAddress?: Address,
    creatorAddress?: Address,
    priceMax?: BigNumberish,
    priceMin?: BigNumberish,
    sellStatus?: MarketEventType,
    owner?: Address,
  }

  export interface NFTEvents extends PaginationParams {
    and?: {
      nftId?: string,
      type?: AssetType,
      from?: string,
      to?: string,
      quoteToken?: Address,
      event?: MarketEventType
    }[]
    or?: {
      nftId?: string,
      type?: AssetType,
      from?: string,
      to?: string,
      quoteToken?: Address,
      event?: MarketEventType
    }[]
  }

  export interface Search {
    text: string
    mode: string
  }

  export interface ValidateInput {
    key: 'username' | 'email' | 'shortLink' | 'collectionName' | 'collectionShortUrl' | 'collectionSymbol' | 'nftName',
    value: string
    collectionId?: string
  }
}

/** API Response types **/
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
    avatar?: string
    createdAt?: string
    email?: string
    updatedAt?: string
    username?: string
    bio?: string
    facebookLink?: string
    twitterLink?: string
    telegramLink?: string
    discordLink?: string
    webURL?: string
    coverImage?: string
    shortLink?: string
  }

  export interface UploadImage {
    fileHashes: string[],
    metadataHash: string
  }

  export interface UploadMetadata {
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
    metadata: Record<string, any> | string
    shortUrl: string | null
    status: Status
    type: AssetType
    creators: { userId: string, user: User }[]
    coverImage: string | null
    avatar: string | null
    volumn: string
    totalOwner: number
    totalNft: number
    floorPrice: string
  }

  export interface CollectionDetails {
    collection: Collection
    traitAvailable: {
      key: string;
      count: number;
      traits: {
        value: string;
        count: number;
      }[];
    }[],
    generalInfo: {
      volumn: string
      totalOwner: number
      totalNft: number
      floorPrice: string
    }
  }

  export interface CollectionsData {
    data: Collection[],
    paging: Pagination
  }

  export interface GenerateTokenId {
    u2uId: string
    id: string
  }

  export interface CreateNFT {
    tokenId: string
  }

  export interface NFT {
    id: string
    u2uId: string
    name: string
    ipfsHash: string
    createdAt: string
    updatedAt: string
    status: Status,
    tokenUri: string,
    txCreationHash: string,
    creatorId: string,
    collectionId: string,
    totalSupply?: string
    creator: {
      avatar: null | string
      email: string | null
      id: string
      publicKey: Address
      username: string
    },
    owners: {
      username: string
      avatar: string
      email: string
      publicKey: Address
      quantity: string
    }[],
    collection: Collection,
    traits: Trait[]
    sellInfo: MarketEvent[]
    bidInfo: MarketEvent[]
    image: string
    price?: BigNumberish
    sellStatus?: MarketEventType
  }

  export interface FetchNFTs {
    data: NFT[]
    paging: Pagination
  }

  export interface User {
    id: string
    email: string
    avatar?: string | null
    username: string | null
    signature: Address
    signedMessage: string
    signer: Address
    publicKey: string
    signDate: string
    acceptedTerms: boolean
    createdAt: string
    updatedAt?: string | null
    bio?: string | null
    coverImage?: string | null
  }

  export type NFTEvents = MarketEvent[]

  export interface NFTMetaData {
    data: {
      description?: string
      traits?: Trait[]
      fileHashes?: string[]
      type: string
    } & Record<string, any>
  }

  export type SearchNFTs = {
    id: string,
    name: string,
    ipfsHash: string,
    image: string,
    createdAt: string,
    updatedAt: string,
    status: Status,
    tokenUri: string,
    txCreationHash: string,
    creatorId: string,
    collectionId: string
    collection: Collection
  }[]

  export type SearchCollections = {
    id: string,
    txCreationHash: string,
    name: string,
    symbol: string,
    description: string,
    address: Address,
    shortUrl: string,
    metadata: string,
    status: Status,
    type: AssetType,
    categoryId?: string,
    createdAt: string,
    updatedAt: string,
    coverImage?: string,
    avatar?: string
  }[]

  export type SearchUsers = {
    id: string
    signer: Address
    username: string
    avatar?: string
  }[]
}