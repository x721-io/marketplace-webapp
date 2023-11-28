import { APIResponse } from '@/services/api/types'
import { Address, erc20ABI, useContractRead, useContractWrite } from 'wagmi'
import { useMemo } from 'react'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { AssetType } from '@/types'
import { useTransactionStatus } from '@/hooks/useTransactionStatus'
import { MaxInt256, parseEther } from 'ethers'

export const useNFTMarketStatus = (nft: APIResponse.NFT) => {
  const { owners, sellInfo, bidInfo } = useMemo(() => nft, [nft])
  const userId = useAuthStore(state => state.profile?.id)
  const wallet = useAuthStore(state => state.profile?.publicKey)

  const isOwner = useMemo(() => {
    return owners.some(owner => owner.publicKey === wallet)
  }, [userId, owners])

  const saleData = useMemo(() => {
    return sellInfo?.find(item => item.event === 'AskNew')
  }, [sellInfo])

  const isOnSale = useMemo(() => !!saleData, [saleData])

  const hasBidder = useMemo(() => !!bidInfo?.length, [bidInfo])

  const isBidder = useMemo(
    () => bidInfo?.some(bid => bid.to === wallet?.toLowerCase()),
    [bidInfo]
  )

  return {
    isOwner,
    isOnSale,
    saleData,
    hasBidder,
    isBidder
  }
}

export const useMarketApproval = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const marketContract = type === 'ERC721' ? contracts.erc721Market : contracts.erc1155Market
  const wallet = useAuthStore(state => state.profile?.publicKey)

  const { data: isMarketContractApproved } = useContractRead({
    address: nft.collection.address,
    abi: type === 'ERC721' ? contracts.erc721.abi : contracts.erc1155.abi,
    functionName: 'isApprovedForAll',
    args: [wallet, marketContract.address],
    enabled: !!wallet
  })

  const {
    isLoading: isFetchingApproval,
    writeAsync: onApproveMarketContract,
    error: contractCallError
  } = useContractWrite({
    address: nft.collection.address,
    abi: type === 'ERC721' ? contracts.erc721.abi : contracts.erc1155.abi,
    functionName: 'setApprovalForAll',
    args: [marketContract.address, true]
  })

  return {
    isMarketContractApproved,
    onApproveMarketContract,
    isFetchingApproval,
    contractCallError
  }
}

export const useMarketTokenApproval = (token: Address, type: AssetType) => {
  const wallet = useAuthStore(state => state.profile?.publicKey)
  const marketContract = type === 'ERC721' ? contracts.erc721Market : contracts.erc1155Market
  const { txStatus, updateHash } = useTransactionStatus()

  const { data: allowance, isLoading: isFetchingApproval } = useContractRead({
    address: token,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [wallet as Address, marketContract.address],
    enabled: !!wallet && !!token
  })

  const isTokenApproved = useMemo(() => {
    if (!allowance) return false
    return (allowance) > BigInt(0)
  }, [allowance])

  const { writeAsync, error: writeError } = useContractWrite({
    address: token,
    abi: erc20ABI,
    functionName: 'approve',
    args: [marketContract.address, MaxInt256]
  })

  const onApproveToken = async () => {
    const { hash } = await writeAsync()
    updateHash(hash)
  }
  return { isTokenApproved, onApproveToken, writeError, isFetchingApproval, ...txStatus }
}

const useWriteMarketContract = (type: AssetType, functionName: string) => {
  const marketContract = type === 'ERC721' ? contracts.erc721Market : contracts.erc1155Market

  return useContractWrite({
    ...marketContract,
    functionName
  })
}

export const useSellNFT = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(type, 'createAsk')

  const onSellNFT = async (price: string, quoteToken: Address, quantity?: string) => {
    const args = [
      nft.collection.address,
      nft.id,
      type === 'ERC1155' && quantity,
      quoteToken,
      parseEther(price)
    ].filter(Boolean)
    const { hash } = await writeAsync?.({ args })
    updateHash(hash)
  }

  return { onSellNFT, writeError, ...txStatus }
}

export const useCancelSellNFT = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(type, 'cancelAsk')
  const { saleData } = useNFTMarketStatus(nft)

  const onCancelSell = async () => {
    const args = type === 'ERC721' ? [nft.collection.address, nft.id] : [saleData?.operationId]
    const { hash } = await writeAsync?.({ args })
    updateHash(hash)
  }

  return { onCancelSell, writeError, ...txStatus }
}

export const useBuyNFT = (nft: APIResponse.NFT) => {
  const { saleData } = useNFTMarketStatus(nft)
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(nft.collection.type, 'buy')

  const onBuyERC721 = async () => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.id, saleData?.quoteToken, saleData?.price]
    })
    updateHash(hash)
  }

  const onBuyERC1155 = async (quantity: string) => {
    const { hash } = await writeAsync?.({
      args: [saleData?.operationId, quantity]
    })
    updateHash(hash)
  }

  return { onBuyERC721, onBuyERC1155, writeError, ...txStatus }
}

export const useBidNFT = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(type, type === 'ERC721' ? 'createBid' : 'createOffer')

  const onBidNFT = async (price: string, quoteToken: Address, quantity?: string) => {
    const args = [
      nft.collection.address,
      nft.id,
      type === 'ERC1155' && quantity,
      quoteToken,
      parseEther(price)
    ].filter(Boolean)

    const { hash } = await writeAsync?.({ args })
    updateHash(hash)
  }
  return { onBidNFT, writeError, ...txStatus }
}

export const useCancelBidNFT = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(type, type === 'ERC721' ? 'cancelBid' : 'cancelOffer')

  const onCancelBid = async (operationId?: string) => {
    const args = type === 'ERC721' ? [nft.collection.address, nft.id] : [operationId]
    const { hash } = await writeAsync?.({ args })
    updateHash(hash)
  }

  return { onCancelBid, writeError, ...txStatus }
}

export const useAcceptBidNFT = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(type, type === 'ERC721' ? 'acceptBid' : 'acceptOffer')
  const { saleData } = useNFTMarketStatus(nft)

  const onAcceptERC721Bid = async (bidder: Address) => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.id, bidder, saleData?.quoteToken, saleData?.price]
    })
    updateHash(hash)
  }

  const onAcceptERC1155Bid = async (offerId: string, quantity: string) => {
    const { hash } = await writeAsync?.({
      args: [offerId, quantity]
    })
    updateHash(hash)
  }

  return { onAcceptERC721Bid, onAcceptERC1155Bid, writeError, ...txStatus }
}