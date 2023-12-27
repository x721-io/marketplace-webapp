import { Address } from 'wagmi'
import { BigNumberish } from 'ethers'

export type MarketEventType = 'AskNew' | 'AskCancel' | 'Trade' | 'AcceptBid' | 'Bid' | 'CancelBid'

export interface MarketEvent {
  id: string,
  event: MarketEventType
  nftId: {
    id: string
    tokenId: string
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