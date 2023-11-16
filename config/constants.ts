export const RPC_URL = process.env.NODE_ENV === 'development' ? 'https://rpc-nebulas-testnet.uniultra.xyz' : 'https://rpc-mainnet.uniultra.xyz'
export const NETWORK_NAME = process.env.NODE_ENV === 'development' ? 'U2U nebula testnet' : 'U2U Solaris mainnet'
export const BLOCK_EXPLORER_URL = process.env.NODE_ENV === 'development' ? 'https://testnet.u2uscan.xy' : 'https://u2uscan.xyz/'
export const CHAIN_ID = process.env.NODE_ENV === 'development' ? 2484 : 39
export const SIGN_MESSAGE = {
  CONNECT: (time: string) => `I want to login on U2UNFTMarket at ${time}. I accept the U2U Terms of Service https://unicornultra.xyz and I am at least 13 years old.`
}