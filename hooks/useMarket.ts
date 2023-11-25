import { APIResponse } from '@/services/api/types'
import { Address, useContractRead, useContractWrite } from 'wagmi'
import { useMemo } from 'react'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { AssetType } from '@/types'
import { useTransactionStatus } from '@/hooks/useTransactionStatus'
import { parseEther } from 'ethers'

export const useNFTMarketStatus = (nft: APIResponse.NFT) => {
  const { collection, sellInfo, owners } = useMemo(() => nft, [nft])

  const type = collection.type
  const userId = useAuthStore(state => state.profile?.id)

  const isOwner = useMemo(() => userId === owners[0].userId, [userId, owners])

  const isOnSale = useMemo(() => {
    const saleData = type === 'ERC721' ? sellInfo?.marketEvent721S : sellInfo?.marketEvent1155S
    if (!saleData) return false
    return saleData[0]?.event === 'AskNew'
  }, [sellInfo])

  const { price, quoteToken } = useMemo(() => {
    const saleData = type === 'ERC721' ? sellInfo?.marketEvent721S : sellInfo?.marketEvent1155S
    if (!saleData || !saleData[0] || saleData[0]?.event !== 'AskNew') {
      return {
        price: 0,
        quoteToken: '0x'
      }
    }
    return saleData[0]
  }, [sellInfo])

  return {
    isOwner,
    isOnSale,
    price,
    quoteToken
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
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(nft.collection.type, 'cancelAsk')

  const onCancelSell = async () => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.id]
    })
    updateHash(hash)
  }

  return { onCancelSell, writeError, ...txStatus }
}

export const useBuyNFT = (nft: APIResponse.NFT) => {
  const { price, quoteToken } = useNFTMarketStatus(nft)
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(nft.collection.type, 'buy')

  const onBuyERC721 = async () => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.id, quoteToken, price]
    })
    updateHash(hash)
  }

  const onBuyERC1155 = async (askId: string, quantity: string) => {
    const { hash } = await writeAsync?.({
      args: [askId, quantity]
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
      price
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

  const onCancelERC721lBid = async () => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.id]
    })
    updateHash(hash)
  }

  const onCancelERC1155Bid = async (bidId: string) => {
    const { hash } = await writeAsync?.({
      args: [bidId]
    })
    updateHash(hash)
  }

  return { onCancelERC721lBid, onCancelERC1155Bid, writeError, ...txStatus }
}

export const useAcceptBidNFT = (nft: APIResponse.NFT) => {
  const type = nft.collection.type
  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync, error: writeError } = useWriteMarketContract(type, type === 'ERC721' ? 'acceptBid' : 'acceptOffer')
  const { price, quoteToken } = useNFTMarketStatus(nft)

  const onAcceptERC721Bid = async (bidder: Address) => {
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