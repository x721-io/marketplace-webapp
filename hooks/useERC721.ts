import { useAccount, useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'

export const useERC721 = () => {
  const { address } = useAccount()
  const args = [
    {
      tokenId: address + "000000000000000000001027",
      tokenURI: "uri:/",
      creators: [{ account: address, value: 10000 }],
      royalties: [],
      signatures: ["0x"]
    },
    address
  ]
  const {} = useContractWrite({
    ...contracts.erc721Meta,
    functionName: 'mintAndTransfer',
    args: args
  })
}