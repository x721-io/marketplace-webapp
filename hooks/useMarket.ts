import { APIResponse } from '@/services/api/types'
import { Address, erc20ABI, useContractRead, useContractWrite } from 'wagmi'
import { useMemo } from 'react'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { AssetType } from '@/types'
import { useTransactionStatus } from '@/hooks/useTransactionStatus'
import { BigNumberish, formatEther, formatUnits, MaxInt256, parseEther } from 'ethers'
import { FINGERPRINT } from '@/config/constants'

export const useNFTMarketStatus = (nft: APIResponse.NFT) => {
  const type = nft.collection.type

  const { owners, sellInfo, bidInfo } = useMemo(() => nft, [nft])
  const userId = useAuthStore(state => state.profile?.id)
  const wallet = useAuthStore(state => state.profile?.publicKey)

  const isOwner = useMemo(() => {
    return owners.some(owner => owner.publicKey === wallet)
  }, [userId, owners])

  const isOnSale = useMemo(() => !!sellInfo?.length, [sellInfo])

  const hasBidder = useMemo(() => !!bidInfo?.length, [bidInfo])

  const isBidder = useMemo(
    () => bidInfo?.some(bid => bid.to === wallet?.toLowerCase()),
    [bidInfo]
  )
  const saleData = useMemo(() => {
    if (!sellInfo?.length) return undefined
    if (type === 'ERC721') {
      return sellInfo[0]
    }
    if (type === 'ERC1155') { // Find the lowest price in sell data
      return sellInfo?.reduce((prev, curr) => {
        return parseEther(String(prev.price)) < parseEther(String(curr.price)) ? prev : curr
      })
    }
  }, [sellInfo])

  return {
    saleData,
    isOwner,
    isOnSale,
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

  const onCancelSell = async (operationId?: string) => {
    const args = type === 'ERC721' ? [nft.collection.address, nft.id] : [operationId]
    const { hash } = await writeAsync?.({ args })
    updateHash(hash)
  }

  return { onCancelSell, writeError, ...txStatus }
}

export const useBuyNFT = (nft: APIResponse.NFT) => {
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(nft.collection.type, 'buy')

  const onBuyERC721 = async (quoteToken: Address, price: BigNumberish) => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.id, quoteToken, price, FINGERPRINT]
    })
    updateHash(hash)
  }

  const onBuyERC1155 = async (operationId: string, quantity: string) => {
    const { hash } = await writeAsync?.({
      args: [operationId, quantity]
    })
    updateHash(hash)
  }

  return { onBuyERC721, onBuyERC1155, writeError, ...txStatus }
}

export const useBuyUsingNative = (nft: APIResponse.NFT) => {
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(nft.collection.type, 'buyUsingEth')

  const onBuyERC721 = async (price: BigNumberish) => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.id, FINGERPRINT],
      value: BigInt(price)
    })
    updateHash(hash)
  }

  const onBuyERC1155 = async (operationId: string, price: BigNumberish, quantity: string) => {
    const { hash } = await writeAsync?.({
      args: [operationId, quantity],
      value: BigInt(price) * BigInt(quantity)
    })
    updateHash(hash)
  }

  return { onBuyERC721, onBuyERC1155, writeError, ...txStatus }
}

export const useBidNFT = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const { txStatus, updateHash } = useTransactionStatus()
  const {
    writeAsync,
    error: writeError
  } = useWriteMarketContract(type, type === 'ERC721' ? 'createBid' : 'createOffer')

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

export const useBidUsingNative = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const { txStatus, updateHash } = useTransactionStatus()
  const {
    writeAsync,
    error: writeError
  } = useWriteMarketContract(type, type === 'ERC721' ? 'createBidUsingEth' : 'createOfferUsingEth')

  const onBidUsingNative = async (price: string, quantity?: string) => {
    const args = type === 'ERC721' ? [
      nft.collection.address,
      nft.id,
      FINGERPRINT
    ] : [
      nft.collection.address,
      nft.id,
      quantity,
      parseEther(price)
    ]

    const { hash } = await writeAsync?.({
      args,
      value: type === 'ERC721' ? parseEther(price) : parseEther(price) * BigInt(quantity ?? 0)
    })
    updateHash(hash)
  }
  return { onBidUsingNative, writeError, ...txStatus }
}

export const useCancelBidNFT = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const { txStatus, updateHash } = useTransactionStatus()
  const {
    writeAsync,
    error: writeError
  } = useWriteMarketContract(type, type === 'ERC721' ? 'cancelBid' : 'cancelOffer')

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
  const {
    writeAsync,
    error: writeError
  } = useWriteMarketContract(type, type === 'ERC721' ? 'acceptBid' : 'acceptOffer')

  const onAcceptERC721Bid = async (bidder: Address, quoteToken: Address, price: BigNumberish) => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.id, bidder, quoteToken, price]
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