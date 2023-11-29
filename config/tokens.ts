import { URC20Token } from '@/types'

export const tokens: Record<string, URC20Token> = {
  wu2u: {
    name: 'Unicorn Ultra Token',
    symbol: 'U2U',
    decimal: 18,
    address: '0x59541A6A47C410270BF419aCabe40963d75Fce5D'
  }
}

export const tokenOptions = Object.values(tokens).map(token => ({ label: token.symbol, value: token.address }))