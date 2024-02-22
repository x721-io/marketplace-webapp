import { NFT } from "@/types"
import { Address } from 'wagmi';
import { readContract, waitForTransaction, writeContract } from '@wagmi/core';
import { contracts } from "@/config/contracts";
import { parseEther } from "ethers";

export const useBidURC721UsingNative = async (nft: NFT, price: any) => {
    const {hash} = await writeContract({
        ...contracts.erc721Market,
        functionName: 'createBidUsingEth',
        args: [nft.collection.address, (nft.u2uId ?? nft.id) as any, price]
    });
    const totalPrice = parseEther(price)
    const [_, buyerFee] = await readContract({
        ...contracts.feeDistributorContract,
        functionName: 'calculateFee',
        args: [totalPrice, nft.collection.address, (nft.u2uId || nft.id) as any]
      });
    const totalCost = totalPrice + buyerFee;

    await waitForTransaction({ hash });
    return totalCost
}

export const useBidURC1155UsingNative = async (nft: NFT, pricePerUnit?: any, price?: string, quantity?: any) => {
    const {hash} = await writeContract({
        ...contracts.erc1155Market,
        functionName: 'createOfferUsingEth',
        args: [
          nft.collection.address,
          (nft.u2uId ?? nft.id) as any,
          quantity,
          pricePerUnit
        ],
    });

    const totalPrice = parseEther(price || '') * BigInt(quantity ?? 0);
    const pricePer = parseEther(price || '');
    const [_, buyerFee] = await readContract({
        ...contracts.feeDistributorContract,
        functionName: 'calculateFee',
        args: [totalPrice, nft.collection.address, (nft.u2uId || nft.id) as any]
      });
      const totalCost = totalPrice + buyerFee;

    await waitForTransaction({ hash })
    return {totalCost, pricePer}
}

export const useBidURC721UsingURC20 = async (nft: NFT, price: any, quoteToken: Address) => {
    const { hash } = await writeContract({
        ...contracts.erc721Market,
        functionName: 'createBid',
        args: [nft.collection.address, (nft.u2uId ?? nft.id) as any, quoteToken, parseEther(price)]

    });
    await waitForTransaction({ hash })
}

export const useBidURC1155UsingURC20 = async (nft: NFT, price: any, quoteToken: Address, quantity: string) => {
    const { hash } = await writeContract({
        ...contracts.erc1155Market,
      functionName: 'createOffer',
      args: [nft.collection.address, (nft.u2uId ?? nft.id) as any, quantity as any, quoteToken, parseEther(price)]
    
    });
    await waitForTransaction({ hash })
}

export const useCancelBidURC721 = async (nft: NFT ) => {
    const { hash } = await writeContract({
        ...contracts.erc721Market,
        functionName: 'cancelBid',
        args: [nft.collection.address, (nft.u2uId ?? nft.id) as any],
        value: BigInt(0) as any
      });
    await waitForTransaction({ hash })
}

export const useCancelBidURC1155 = async (operationId?: string ) => {
    const { hash } = await  writeContract({
        ...contracts.erc1155Market,
        functionName: 'cancelOffer',
        args: [operationId as any],
        value: BigInt(0) as any
      });
    await waitForTransaction({ hash })
}

export const useAcceptBidURC721 = async (nft: NFT, bidder: Address, quoteToken: Address ) => { 
    const { hash } = await  writeContract({
        ...contracts.erc721Market,
        functionName: 'acceptBid',
        args: [
            nft.collection.address, 
            BigInt(nft.u2uId) ?? BigInt(nft.id), 
            bidder, 
            quoteToken
        ]
      });
    await waitForTransaction({ hash })
}

export const useAcceptBidURC1155 = async (offerId: string, quantity: number ) => { 
    const { hash } = await  writeContract({
        ...contracts.erc1155Market,
        functionName: 'acceptOffer',
        args: [
            BigInt(offerId), 
            BigInt(quantity)
        ],
      });
    await waitForTransaction({ hash })
}

export const useBidNFT = (nft: NFT, pricePerUnit: any, price: any, quantity: any, quoteToken: Address, operationId: string, bidder: Address, offerId: string ) => {
    const bidURC721UsingNative = useBidURC721UsingNative(nft, price)
    const bidURC1155UsingNative = useBidURC1155UsingNative(nft, pricePerUnit, price, quantity)
    const bidURC721UsingURC20 = useBidURC721UsingURC20(nft, price, quoteToken)
    const bidURC1155UsingURC20 = useBidURC1155UsingURC20(nft, price, quoteToken, quantity)
    const cancelBidURC721UsingURC20 = useCancelBidURC721(nft)
    const cancelBidURC1155UsingURC20 = useCancelBidURC1155(operationId)
    const acceptBidURC721UsingURC20 = useAcceptBidURC721(nft, bidder, quoteToken)
    const acceptBidURC1155UsingURC20 = useAcceptBidURC1155(offerId, quantity)

    return {
        bidURC721UsingNative,
        bidURC1155UsingNative,
        bidURC721UsingURC20,
        bidURC1155UsingURC20,
        cancelBidURC721UsingURC20,
        cancelBidURC1155UsingURC20,
        acceptBidURC721UsingURC20,
        acceptBidURC1155UsingURC20
    }
}