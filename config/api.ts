export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL

export const API_ENDPOINTS = {
  CONNECT: '/auth/connect',
  PROFILE: '/user/profile',
  COLLECTIONS: '/collection',
  USER_COLLECTIONS: '/collection/user',
  UPLOAD_IMAGE: '/common/upload-ipfs',
  TOKEN_ID: '/nft/tokenId',
  NFT: '/nft',
  SEARCH_NFT: '/nft/search',
  USER: '/user/all',
  NFT_EVENTS: '/nft/events',
  GET_METADATA: '/common/get-ipfs',
  SEARCH: '/common/search-all'
}