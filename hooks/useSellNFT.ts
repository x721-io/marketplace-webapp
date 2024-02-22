import { contracts } from '@/config/contracts';
import { waitForTransaction, writeContract } from '@wagmi/core';
import { NFT } from "@/types";
import { parseEther } from "ethers";
import { Address } from 'wagmi';

export const useSellURC721 = async (nft: NFT, price: number, quoteToken: Address) => {
    const { hash } = await writeContract({
        abi: contracts.erc721Market.abi,
        address: contracts.erc721Market.address,
        functionName: 'createAsk',
        args: [
            nft.collection.address,
            BigInt(nft.u2uId) ?? BigInt(nft.id),
            quoteToken,
            parseEther(String(price))
        ]
    });
    await waitForTransaction({ hash })
};

export const useSellURC1155 = async (nft: NFT, price: number, quoteToken: Address, quantity: any) => {
    const { hash } = await writeContract({
        abi: contracts.erc1155Market.abi,
        address: contracts.erc1155Market.address,
        functionName: 'createAsk',
        args: [
            nft.collection.address,
            BigInt(nft.u2uId) ?? BigInt(nft.id),
            quantity,
            quoteToken,
            parseEther(String(price))
        ]
    });
    await waitForTransaction({ hash })
};

export const useCancelSellURC721 = async (nft: NFT) => {
    const { hash } = await writeContract({
        abi: contracts.erc721Market.abi,
        address: contracts.erc721Market.address,
        functionName: 'cancelAsk',
        args: [
            nft.collection.address,
            BigInt(nft.u2uId ?? nft.id)
        ]
    });
    await waitForTransaction({ hash })
};

export const useCancelSellURC1155 = async (operationId: string) => {
    const { hash } = await writeContract({
        abi: contracts.erc1155Market.abi,
        address: contracts.erc1155Market.address,
        functionName: 'cancelAsk',
        args: [
            BigInt(operationId)
        ]
    });
    await waitForTransaction({ hash })
};

export const useSellNFT = (nft: NFT, price: number, quoteToken: Address, quantity: any, operationId: string) => {
    const sellURC721 = useSellURC721(nft, price, quoteToken)
    const sellURC1155 = useSellURC1155(nft, price, quoteToken, quantity)
    const cancelSellURC721 = useCancelSellURC721(nft)
    const cancelSellURC1155 = useCancelSellURC1155(operationId)

    return {
        sellURC721,
        sellURC1155,
        cancelSellURC721,
        cancelSellURC1155
    }
}