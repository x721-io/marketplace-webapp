import { NFT, User } from '@/types'

export const classNames = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ')
}

export const shortenAddress = (str: string = '', head: number = 6, tail: number = 4) => {
  if (!str) return ''
  return `${str.substring(0, head)}...${str.substring(str.length - tail)}`
}

export const getUserLink = (user?: Partial<Pick<User, 'shortLink' | 'id' | 'publicKey' | 'signer'>> | null) => {
  if (!user) return '#'
  const queryString = user.shortLink ?? user.id ?? user.publicKey ?? user.signer
  return `/user/${queryString}`
}

export const getNFTLink = (nft?: NFT | null) => {
  if (!nft) return '#'

  return `/item/${nft.collection.address}/${nft.id}`
}