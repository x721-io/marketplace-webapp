import { BASE_API_URL } from '@/config/api'

export const parseImageUrl = (hash?: string) => {
  if (!hash) return ''
  return BASE_API_URL + '/common/get-file-ipfs?hash=' + hash
}

export const getMetaDataHash = (url: string) => {
  return url.replace("ipfs://", "")
}