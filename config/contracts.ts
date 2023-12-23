import { Address } from 'wagmi'
import erc721MarketABI from '@/abi/ERC721Marketplace.json'
import erc721Factory from '@/abi/ERC721Factory.json'
import erc721ABI from '@/abi/ERC721Rarible.json'
import erc1155MarketABI from '@/abi/ERC1155Marketplace.json'
import erc1155FactoryABI from '@/abi/ERC1155Factory.json'
import erc1155ABI from '@/abi/ERC1155.json'
import * as process from 'process'

export type Contract = {
  address: Address,
  abi: any
}

export const contracts: Record<string, Contract> = {
  erc721Market: { address: process.env.NEXT_PUBLIC_ERC721_MARKET_CONTRACT as Address, abi: erc721MarketABI },
  erc721Factory: { address: process.env.NEXT_PUBLIC_ERC721_FACTORY_CONTRACT as Address, abi: erc721Factory },
  erc721Proxy: { address: process.env.NEXT_PUBLIC_ERC721_PROXY_CONTRACT as Address, abi: erc721ABI },
  erc721: { address: process.env.NEXT_PUBLIC_ERC721_U2U_BASE_CONTRACT as Address, abi: erc721ABI },
  erc1155Market: { address: process.env.NEXT_PUBLIC_ERC1155_MARKET_CONTRACT as Address, abi: erc1155MarketABI },
  erc1155Factory: { address: process.env.NEXT_PUBLIC_ERC1155_FACTORY_CONTRACT as Address, abi: erc1155FactoryABI },
  erc1155Proxy: { address: process.env.NEXT_PUBLIC_ERC1155_PROXY_CONTRACT as Address, abi: erc1155ABI },
  erc1155: { address: process.env.NEXT_PUBLIC_ERC1155_U2U_BASE_CONTRACT as Address, abi: erc1155ABI },
  exchange: { address: '0x', abi: [] }
}