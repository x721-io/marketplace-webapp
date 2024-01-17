import { Address } from 'wagmi'
import { BigNumberish } from 'ethers'

export type RoundType =
   'U2UMintRoundFCFS'
   | 'U2UMintRoundWhitelist'
   | 'U2UMintRoundZero'
   | 'U2UPremintRoundFCFS'
   | 'U2UPremintRoundWhitelist'
   | 'U2UPremintRoundZero'
   | 'U2UMintRoundWhitelistCustomized'

export type RoundStatus = 'MINTING' | 'ENDED' | 'UPCOMING' | 'CLAIM'

export type AssetType = 'ERC721' | 'ERC1155'

export interface Round {
  id: number,
  name: string,
  description: string
  projectId: string,
  roundId: number,
  address: Address,
  start: string,
  end: string,
  type: RoundType
  price: BigNumberish
  maxPerWallet: number
  totalNftt: number
  claimableStart: string
  claimableIds: any[],
  requiredStaking: BigNumberish,
  instruction: string,
  stakeBefore: string,
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
