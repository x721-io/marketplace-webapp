import { Collection, NFT, User } from '@/types'

export const classNames = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ')
}

export const shortenAddress = (str: string = '', head: number = 6, tail: number = 4) => {
  if (!str) return '';

  const totalLength = head + tail;
  if (str.length > totalLength) {
    return `${str.substring(0, head)}...${str.substring(str.length - tail)}`;
  } else {
    return str;
  }
}

export const getUserAvatarImage = (user?: Partial<Pick<User, 'username'| 'avatar'>> | null) => {
  return user?.avatar || `https://avatar.vercel.sh/${user?.username}`
}

export const getUserCoverImage =(user?: Partial<Pick<User, 'username' | 'coverImage'>> | null) => {
  return user?.coverImage || `https://avatar.vercel.sh/origin`
}

export const getCollectionAvatarImage = (collection?: Partial<Pick<Collection, 'name' | 'avatar'>>) => {
  return collection?.avatar || `https://avatar.vercel.sh/${collection?.name || 'default'}`
}

export const getCollectionBannerImage = (collection?: Partial<Pick<Collection, 'name' | 'coverImage'>>) => {
  return collection?.coverImage || `https://avatar.vercel.sh/origin`
}

export const getDisplayedUserName = (user?: Partial<Pick<User, 'username' | 'publicKey' | 'signer'>> | null) => {
  if (!user) return ''

  return user.username || shortenAddress(user.signer || user.publicKey)
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

export const truncate = ({ str, headCount = 5, tailCount = 4 }: {
  str: any ;
  headCount?: number;
  tailCount?: number;
}) => {
  if (!str || headCount > str.length - tailCount) {
    return str
  }
  return str.substring(0, headCount - 1) + '....' + str.substring(str.length - tailCount - 1)
}