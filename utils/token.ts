import { Address } from 'wagmi'
import { tokens } from '@/config/tokens'

export const findTokenByAddress = (address?: Address) => {
  if (address === tokens.wu2u.address) {
    return {
      ...tokens.wu2u,
      name: 'Unicorn Ultra Token',
      symbol: 'U2U',
    }
  }
  return Object.values(tokens).find((token) => {
    return token.address.toLowerCase() === address?.toLowerCase()
  })
}