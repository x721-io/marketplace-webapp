import { Address } from "abitype";
import { ADDRESS_ZERO } from "./constants";

interface Token {
  name: string;
  symbol: string;
  decimal: number;
  address: Address;
  logo: string;
  index: number;
}

export const tokens: Record<string, Token> = {
  u2u: {
    name: "U2U",
    symbol: "U2U",
    decimal: 18,
    index: 0,
    address: process.env.NEXT_PUBLIC_U2U_NATIVE_TOKEN_CONTRACT as Address,
    logo: "https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI",
  },
  wu2u: {
    name: "Wrapped U2U",
    symbol: "WU2U",
    index: 1,
    decimal: 18,
    address: process.env.NEXT_PUBLIC_WU2U_CONTRACT as Address,
    logo: "https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI",
  },
  pusdt: {
    name: "Pegged USDT",
    symbol: "pUSDT",
    index: 1,
    decimal: 6,
    address: "0x8Fef26D79DA3Ac2AE5DaC2acfb5A802Fb043E6F0" as Address,
    logo: "https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI",
  },
  // weth: {
  //   name: "WETH",
  //   symbol: "WETH",
  //   decimal: 18,
  //   address: process.env.NEXT_PUBLIC_WETH_CONTRACT as Address,
  //   logo: "https://ug-assets-dev.s3.ap-southeast-1.amazonaws.com/0d38aae1-e5d0-4b10-9e67-b85b13ce0891-wETH.jpg",
  // },
  // wbtc: {
  //   name: "WBTC",
  //   symbol: "WBTC",
  //   decimal: 18,
  //   address: process.env.NEXT_PUBLIC_WBTC_CONTRACT as Address,
  //   logo: "https://ug-assets-dev.s3.ap-southeast-1.amazonaws.com/cc3ff3dd-1d7a-4254-975b-62243326cd6d-wBTC.jpg",
  // }
};

export const tokenOptions = Object.values(tokens)
  .map((token) => {
    if (token.address === tokens.u2u.address) {
      return { label: "U2U", value: tokens.u2u.address, index: token.index };
    }
    if (token.address === tokens.wu2u.address) {
      return { label: "WU2U", value: tokens.wu2u.address, index: token.index };
    }
    return { label: token.symbol, value: token.address, index: token.index };
  })
  .sort((a, b) => a.index - b.index);
