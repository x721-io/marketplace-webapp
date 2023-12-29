import { Address } from 'wagmi'
import { BigNumberish } from 'ethers'
import { Collection, User } from '@/types/entitites'

export type MarketEventType = 'AskNew' | 'AskCancel' | 'Trade' | 'AcceptBid' | 'Bid' | 'CancelBid' | 'Mint' | 'Transfer'

export interface MarketEvent {
  id: string,
  event: MarketEventType
  nftId?: {
    id: string
    tokenId: string
    contract: {
      id: Address
      name: string
    }
  },
  NFT?: {
    animationUrl: string
    id: string
    image: string
    name: string
    u2uId: string
  }

  collection?: Pick<Collection, 'address' | 'id' | 'isU2U' | 'name' | 'shortUrl' | 'status' | 'txCreationHash' | 'type'>
  price: BigNumberish
  to: Partial<Pick<User, 'id' | 'email' | 'shortLink' | 'username' | 'signer' | 'avatar'>> | null
  from: Partial<Pick<User, 'id' | 'email' | 'shortLink' | 'username' | 'signer' | 'avatar'>> | null
  quoteToken: Address
  operationId: string
  amounts: string
  timestamp: number
}
