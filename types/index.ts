import { Address } from 'wagmi'

export type AssetType = 'ERC721' | 'ERC1155'

export interface URC20Token {
  name: string
  symbol: string
  decimal: number
  address: Address
}

export interface Trait {
  trait_type?: string
  value?: string
  display_type?: string
}

export interface Option {
  label: string
  value: any
}