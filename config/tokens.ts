import { URC20Token } from '@/types'

export const tokens: Record<string, URC20Token> = {
  wu2u: {
    name: 'Unicorn Ultra Token',
    symbol: 'U2U',
    decimal: 18,
    address: '0x3d3350A01Ad2a9AEef5A1E3e63840B6892Ba28c0'
  }
}

export const tokenOptions = Object.values(tokens).map(token => ({ label: token.symbol, value: token.address }))