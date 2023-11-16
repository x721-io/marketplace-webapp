export const BASE_API_URL = process.env.NODE_ENV === 'development' ? 'https://marketplace-api-dev.uniultra.xyz/' : ''

export const API_ENDPOINTS = {
  CONNECT: '/auth/connect',
  PROFILE: '/auth/profile'
}