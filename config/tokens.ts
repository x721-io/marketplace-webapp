import { Address } from "wagmi";

export const tokens = {
  wu2u: {
    name: "Wrapped U2U",
    symbol: "WU2U",
    decimal: 18,
    address: process.env.NEXT_PUBLIC_FORTH_ETH_CONTRACT as Address,
    logo: "https://play-lh.googleusercontent.com/NLVnM9o_BuPceMiPEiTCiMsD0KeCjzZqPc_Cj6iMPyzsHXReGkssZihl2vf6NL7qXpI",
  },
};

export const tokenOptions = Object.values(tokens).map((token) => {
  if (token.address === tokens.wu2u.address) {
    return { label: "U2U", value: tokens.wu2u.address };
  }
  return { label: token.symbol, value: token.address };
});
