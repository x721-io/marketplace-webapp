import { URC20Token } from '@/types'
import { Address } from 'wagmi'

export const tokens: Record<string, URC20Token> = {
  wu2u: {
    name: 'Unicorn Ultra Token',
    symbol: 'U2U',
    decimal: 18,
    address: process.env.NEXT_PUBLIC_FORTH_ETH_CONTRACT as Address,
    logo: 'https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI'
  }
}

export const tokenOptions = Object.values(tokens).map(token => ({ label: token.symbol, value: token.address }))