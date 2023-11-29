import { Address } from 'wagmi'
import { Trait } from '@/types/index'

export interface CreateNFTForm {
  image?: Blob,
  name?: string,
  description?: string,
  collection?: Address,
  royalties?: number
  amount?: number
  traits?: Trait[]
}