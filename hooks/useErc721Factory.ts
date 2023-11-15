import { useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import erc721FactoryAbi from '@/abi/erc721-factory.json'

export const useErc721Factory = () => {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: contracts.erc721Factory.address,
    abi: erc721FactoryAbi,
    functionName: ''
  })
}