import { URC20Token } from '@/types'

export const tokens: Record<string, URC20Token> = {
  wu2u: {
    name: 'Unicorn Ultra Token',
    symbol: 'U2U',
    decimal: 18,
    address: '0x374ad52c818675e333256a39a8b64a5ae29adac1'
  }
}

export const tokenOptions = Object.values(tokens).map(token => ({ label: token.symbol, value: token.address }))