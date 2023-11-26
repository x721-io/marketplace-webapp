import { Address } from 'wagmi'
import { tokens } from '@/config/tokens'

export const findTokenByAddress = (address?: Address) => {
  return Object.values(tokens).find((token) => {
    return token.address === address
  })
}