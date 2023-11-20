import { Address } from 'wagmi'
import erc721Factory from '@/abi/ERC721Factory.json'
import erc721MetaABI from '@/abi/ERC721RaribleMeta.json'
import erc1155FactoryABI from '@/abi/ERC1155Factory.json'
import erc1155MetaABI from '@/abi/ERC1155Meta.json'

export type Contract = {
  address: Address,
  abi: any
}

export const contracts: Record<string, Contract> = {
  erc721Factory: { address: '0x6a04845E0A0B3B394d8FF3D82533917eFEf0A15f', abi: erc721Factory },
  erc721Meta: { address: '0xFa11e4aaE80BB788D4f066D676b7A127318957e7', abi: erc721MetaABI },
  erc1155Factory: { address: '0x058DEe0187BE53e48b258F6879b6AEF1b9e55008', abi: erc1155FactoryABI },
  erc1155Meta: { address: '0x8a1C41D496368018356905821dFc5e7782755Ebb', abi: erc1155MetaABI },
  exchange: { address: '0x', abi: [] }
}