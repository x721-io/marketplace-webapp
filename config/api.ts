export const BASE_API_URL = process.env.NODE_ENV === 'development' ? 'https://marketplace-api-dev.uniultra.xyz/' : ''
// export const BASE_API_URL = process.env.NODE_ENV === 'development' ? 'https://b10g0wn1-8888.asse.devtunnels.ms' : ''

export const API_ENDPOINTS = {
  CONNECT: '/auth/connect',
  PROFILE: '/user/profile'
}