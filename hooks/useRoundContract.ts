import { AssetType, Collection, Round } from '@/types'
import { waitForTransaction, writeContract } from '@wagmi/core'
import { getRoundAbi } from '@/utils'

type BuyFunctionName = `buy${AssetType}`
type ClaimFunctionName = `claim${AssetType}`

const getBuyFunctionName = (assetType: AssetType): BuyFunctionName => {
  return <"buyERC721" | "buyERC1155">`buy${assetType}`
}

const getClaimFunctionName = (assetType: AssetType): ClaimFunctionName => {
  return <"claimERC721" | "claimERC1155">`claim${assetType}`
}

export const useWriteRoundContract = (round: Round, collection: Collection) => {
  const roundAbi = getRoundAbi(round)

  const onBuyNFT = async (amount?: number) => {
    const functionName = getBuyFunctionName(collection.type)
    const args = functionName === 'buyERC1155' ? [amount] : []
    const price = functionName === 'buyERC1155' ? BigInt(round.price) * BigInt(amount || 0) : BigInt(round.price)

    const tx = await writeContract({
      address: round.address,
      abi: roundAbi,
      functionName,
      args,
      value: price
    })

    return { hash: tx.hash, waitForTransaction: () => waitForTransaction({ hash: tx.hash }) }
  }

  const onClaimNFT = async () => {
    const functionName = getClaimFunctionName(collection.type)
    const tx = await writeContract({
      address: round.address,
      abi: roundAbi,
      functionName,
      args: [],
    })

    return { hash: tx.hash, waitForTransaction: () => waitForTransaction({ hash: tx.hash }) }
  }

  return {
    onClaimNFT,
    onBuyNFT
  }
}