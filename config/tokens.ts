import { Address } from "wagmi";

interface Token {
  name: string
  symbol: string
  decimal: number
  address: Address,
  logo: string
}

export const tokens: Record<string, Token> = {
  wu2u: {
    name: "Wrapped U2U",
    symbol: "WU2U",
    decimal: 18,
    address: process.env.NEXT_PUBLIC_FORTH_ETH_CONTRACT as Address,
    logo: "https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI",
  },
  usdt: {
    name: "ETH",
    symbol: "ETH",
    decimal: 18,
    // address: process.env.NEXT_PUBLIC_FORTH_ETH_CONTRACT as Address,
    address: '0x36c17Fd9aB448616aAC885d06a58E4B5017Ac9CA',
    logo: "https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI",
  }
};

export const tokenOptions = Object.values(tokens).map((token) => {
  if (token.address === tokens.wu2u.address) {
    return { label: "U2U", value: tokens.wu2u.address };
  }
  return { label: token.symbol, value: token.address };
});
