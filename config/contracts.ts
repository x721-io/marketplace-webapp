import { Address } from 'wagmi'
import erc721Factory from '@/abi/ERC721Factory.json'
import erc721ABI from '@/abi/ERC721Rarible.json'
import erc1155FactoryABI from '@/abi/ERC1155Factory.json'
import erc1155ABI from '@/abi/ERC1155.json'

export type Contract = {
  address: Address,
  abi: any
}

export const contracts: Record<string, Contract> = {
  erc721Factory: { address: '0x346d828a9CD9f72ed967c18538196Ca64468805d', abi: erc721Factory },
  erc721Proxy: { address: '0x73039bafa89e6f17f9a6b0b953a01af5ecabacd2', abi: erc721ABI },
  erc721: { address: '0x3cD13281Ae21ff33A9a6f397b73dC2FC4fe794Ce', abi: erc721ABI },
  erc1155Factory: { address: '0x9e8Fd98d43c5Ef66D8e8472bbDD3CF57Eecd1A3c', abi: erc1155FactoryABI },
  erc1155Proxy: { address: '0x4b1AAC431446D84e238784F8Ad4e31712A7Aeb1B', abi: erc1155ABI },
  erc1155: { address: '0xc2587c1b945b1a7be4be5423c24f1bbf54495daa', abi: erc1155ABI },
  exchange: { address: '0x', abi: [] }
}
// export const contracts: Record<string, Contract> = {
//   erc721Factory: { address: '0x346d828a9CD9f72ed967c18538196Ca64468805d', abi: erc721Factory },
//   erc721Proxy: { address: '', abi: erc721ABI },
//   erc721Minimal: { address: '0x74D1Df53d2FefEADC9E4C715d7aDb9742e711c5F', abi: erc721ABI },
//   erc1155Factory: { address: '0x9e8Fd98d43c5Ef66D8e8472bbDD3CF57Eecd1A3c', abi: erc1155FactoryABI },
//   erc1155Proxy: { address: '', abi: erc1155ABI },
//   erc1155Minimal: { address: '', abi: erc1155ABI },
//   exchange: { address: '0x', abi: [] }
// }