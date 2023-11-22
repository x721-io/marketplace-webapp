import { Address } from 'wagmi'

export interface CreateNFTForm {
  image: Blob,
  name: string,
  description: string,
  collection: Address,
  royalties: number
  amount?: number
}