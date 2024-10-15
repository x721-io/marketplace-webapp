import { Address } from "wagmi";
import { ADDRESS_ZERO } from "./constants";

interface Token {
  name: string;
  symbol: string;
  decimal: number;
  address: Address;
  logo: string;
}

export const tokens: Record<string, Token> = {
  u2u: {
    name: "U2U",
    symbol: "U2U",
    decimal: 18,
    address: ADDRESS_ZERO,
    logo: "https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI",
  },
  // wu2u: {
  //   name: "Wrapped U2U",
  //   symbol: "WU2U",
  //   decimal: 18,
  //   address: "0xDD7Dc2bBeB8f6a9e60C09aCd8174e4FcFAef0647",
  //   logo: "https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI",
  // },
  wu2u: {
    name: "Wrapped U2U",
    symbol: "WU2U",
    decimal: 18,
    address: "0x79538ce1712498fd1b9a9861e62acb257d7506fc",
    logo: "https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI",
  }
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

export const tokenOptions = Object.values(tokens).map((token) => {
  return { label: token.symbol, value: token.address };
});
