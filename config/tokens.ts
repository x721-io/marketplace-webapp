import { Address } from "abitype";

interface Token {
  name: string;
  symbol: string;
  decimal: number;
  address: Address;
  logo: string;
}

export const tokens: Record<string, Token> = {
  wu2u: {
    name: "Wrapped U2U",
    symbol: "WU2U",
    decimal: 18,
    address: process.env.NEXT_PUBLIC_WU2U_CONTRACT as Address,
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

export const tokenOptions = Object.values(tokens).map((token) => {
  if (token.address === tokens.wu2u.address) {
    return { label: "U2U", value: tokens.wu2u.address };
  }
  return { label: token.symbol, value: token.address };
});
