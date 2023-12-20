import { BASE_API_URL } from '@/config/api'

export const parseImageUrl = (url?: string) => {
  if (!url) return ''
  return BASE_API_URL + '/common/ipfs-serve?ipfsPath=' + url
}
