import { contracts } from '@/config/contracts'
import { Address, useContractRead } from 'wagmi'
import { waitForTransaction, writeContract } from '@wagmi/core'
import { Royalties } from '@/types'
import { toast } from 'react-toastify'
import royaltiesRegistryABI from '@/abi/RoyaltiesRegistry'

export const useReadCollectionRoyalties = (collectionAddress: Address) => {
  const royaltiesRegistryContract = contracts.royaltiesRegistry

  return useContractRead({
    ...royaltiesRegistryContract,
    functionName: 'getRoyaltiesByToken',
    args: [collectionAddress],
    enabled: !!collectionAddress,
    watch: true,
    select: ([_, royalties]) => royalties
  })
}

export const useUpdateCollectionRoyalties = () => {
  const royaltiesRegistryContract = contracts.royaltiesRegistry

  return async (collectionAddress: Address, royalties: Royalties) => {
    if (!royalties || !collectionAddress) {
      return toast.error('Collection not found', { autoClose: 1000, closeButton: true })
    }

    const { hash } = await writeContract({
      ...royaltiesRegistryContract,
      functionName: 'setRoyaltiesByToken',
      args: [
        collectionAddress,
        royalties
      ]
    })



    return waitForTransaction({ hash })
  }
}

export const useReadNFTRoyalties = (collectionAddress: Address, tokenId: string) => {
  const royaltiesRegistryContract = contracts.royaltiesRegistry

  return useContractRead({
    ...royaltiesRegistryContract,
    functionName: 'getRoyalties',
    args: [collectionAddress, BigInt(tokenId)],
    enabled: !!collectionAddress && !!tokenId,
    watch: true
  })
}