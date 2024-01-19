export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL


export const API_ENDPOINTS = {
  CONNECT: '/auth/connect',
  PROFILE: '/user/profile',
  COLLECTIONS: '/collection',
  USER_COLLECTIONS: '/collection/user',
  UPLOAD_IMAGE: '/common/upload-ipfs',
  TOKEN_ID: '/nft/tokenId',
  NFT: '/nft',
  NFT_TRANSACTIONS: '/nft/nftTransactionInfo',
  SEARCH_NFT: '/nft/search',
  NFT_EVENTS: '/nft/activity',
  GET_METADATA: '/common/ipfs-serve',
  USER: '/user/all',
  USER_ACTIVITIES: '/user/activity',
  SEARCH: '/common/search-all',
  VALIDATE_INPUT: '/validator',
  LAUNCHPAD : '/launchpad',
  CHECK_IS_SUBSCRIBED: '/launchpad/isSubscribed',
  SUBSCRIBE_ROUND_ZERO: '/launchpad/subscribe',
  SNAPSHOT: '/user/projects',
}