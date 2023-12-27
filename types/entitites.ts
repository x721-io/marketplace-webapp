import { Address } from 'wagmi'
import { MarketEvent, MarketEventType } from '@/types/market'
import { BigNumberish } from 'ethers'

export type AssetType = 'ERC721' | 'ERC1155'

export type EntityStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

export interface Trait {
  trait_type?: string
  value?: string
  display_type?: string
}

export interface NFTMetadata {
  name?: string
  description?: string
  attributes?: Trait[]
  fileHashes?: string[]
  external_url?: string
  animation_url?: string
  type: string
}

export interface User {
  id: string
  email: string
  avatar?: string
  username: string
  signature: Address
  signedMessage: string
  signer: Address
  publicKey: Address
  signDate: string
  acceptedTerms: boolean
  createdAt: string
  updatedAt?: string
  bio?: string
  coverImage?: string
  facebookLink?: string
  twitterLink?: string
  telegramLink?: string
  discordLink?: string
  webURL?: string
  shortLink?: string
}

export interface NFT {
  id: string
  u2uId: string
  name: string
  status: EntityStatus,
  tokenUri: string,
  txCreationHash: string,
  creatorId: string,
  collectionId: string,
  image: string
  animationUrl: string
  createdAt: string
  updatedAt: string
  creator: {
    avatar: null | string
    email: string | null
    id: string
    publicKey: Address
    username: string
  } | null,
  owners: {
    username: string
    avatar: string
    email: string
    publicKey: Address
    quantity: string
    id: string
  }[],
  collection: Collection,
  traits?: Trait[]
  sellInfo: MarketEvent[]
  bidInfo: MarketEvent[]
  price?: BigNumberish
  sellStatus?: MarketEventType
  totalSupply?: string
}

export interface Collection {
  id: string
  txCreationHash: string
  name: string | null
  symbol: string
  address: Address
  isU2U: boolean
  description?: string | null
  categoryId: number | null
  createdAt: string
  updatedAt: string
  metadata: Record<string, any> | string
  shortUrl: string | null
  status: EntityStatus
  type: AssetType
  creators: { userId: string, user: User }[]
  coverImage: string | null
  avatar: string | null
  volumn: string
  totalOwner: number
  totalNft: number
  floorPrice: string
}