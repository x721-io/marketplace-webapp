import { Address } from 'wagmi'
import erc721ABI from '@/abi/erc721.json'
import erc721Factory from '@/abi/erc721-factory.json'
import erc1155ABI from '@/abi/erc1155.json'
import erc1155FactoryABI from '@/abi/erc1155-factory.json'

export type Contract = {
  address: Address,
  abi: any
}

export const contracts: Record<string, Contract> = {
  erc721: { address: '0x74D1Df53d2FefEADC9E4C715d7aDb9742e711c5F', abi: erc721ABI },
  erc721Factory: { address: '0x346d828a9CD9f72ed967c18538196Ca64468805d', abi: erc721Factory },
  erc1155: { address: '0xd8c5F75Aa01dC3db284F9F3C697C76C0D9DeB3A3', abi: erc1155ABI },
  erc1155Factory: { address: '0x9e8Fd98d43c5Ef66D8e8472bbDD3CF57Eecd1A3c', abi: erc1155FactoryABI },
  exchange: { address: '0xd8c5F75Aa01dC3db284F9F3C697C76C0D9DeB3A3', abi: [] }
}