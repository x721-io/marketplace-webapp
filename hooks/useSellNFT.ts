import { contracts } from '@/config/contracts';
import { waitForTransaction, writeContract, readContract } from '@wagmi/core';
import { NFT } from "@/types";
import { parseEther } from "ethers";
import { Address } from 'wagmi';

export const useSellURC721 = (nft: NFT) => {
    const onSellURC721 = async (price: number, quoteToken: Address) => {
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
        return waitForTransaction({ hash })
    }

    return onSellURC721
};

export const useSellURC1155 = (nft: NFT) => {
    const onSellURC1155 = async (price: number, quoteToken: Address, quantity: any) => {
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
        return waitForTransaction({ hash })
    }
    return onSellURC1155
};

export const useCancelSellURC721 = (nft: NFT) => {
    const onCancelSellURC721 = async () => {
        const { hash } = await writeContract({
            abi: contracts.erc721Market.abi,
            address: contracts.erc721Market.address,
            functionName: 'cancelAsk',
            args: [
                nft.collection.address,
                BigInt(nft.u2uId ?? nft.id)
            ]
        });
        return waitForTransaction({ hash })
    }
    return onCancelSellURC721
};

export const useCancelSellURC1155 = () => {
    const onCancelSellURC1155 = async (operationId: string) => {
        const { hash } = await writeContract({
            abi: contracts.erc1155Market.abi,
            address: contracts.erc1155Market.address,
            functionName: 'cancelAsk',
            args: [
                BigInt(operationId)
            ]
        });
        return waitForTransaction({ hash })
    }
    return onCancelSellURC1155
};

export const useApprovalSellForAllURC721 = (nft: NFT) => {

    const onApprovalSellForAllURC721 = async () => {
        const { hash } = await writeContract({
            address: nft.collection.address,
            abi: contracts.erc721Base.abi,
            functionName: 'setApprovalForAll',
            args: [contracts.erc721Market.address, true],
            value: BigInt(0) as any
        });
        return waitForTransaction({ hash })
    }
    return onApprovalSellForAllURC721
};

export const useApprovalSellForAllURC1155 = (nft: NFT) => {
    const onApprovalSellForAllURC1155 = async () => {
        const { hash } = await writeContract({
            address: nft.collection.address,
            abi: contracts.erc1155Base.abi,
            functionName: 'setApprovalForAll',
            args: [contracts.erc1155Market.address, true],
            value: BigInt(0) as any
        });
        return waitForTransaction({ hash })
    }
    return onApprovalSellForAllURC1155
};

export const useApprovalSellForSingleURC721 = (nft: NFT) => {
    const onApprovalSellForSingleURC721 = async () => {
        const { hash } = await writeContract({
            address: nft.collection.address,
            abi: contracts.erc721Base.abi,
            functionName: 'approve',
            args: [contracts.erc721Market.address, BigInt(nft.u2uId)],
            value: BigInt(0) as any
        });
        return waitForTransaction({ hash })
    }
    return onApprovalSellForSingleURC721
};

export const useSellNFT = (nft: NFT) => {
    const sellURC721 = useSellURC721(nft)
    const sellURC1155 = useSellURC1155(nft)
    const cancelSellURC721 = useCancelSellURC721(nft)
    const cancelSellURC1155 = useCancelSellURC1155()
    const approvalSellForAllURC721 = useApprovalSellForAllURC721(nft)
    const approvalSellForAllURC1155 = useApprovalSellForAllURC1155(nft)
    const approvalSellForSingleURC721 = useApprovalSellForSingleURC721(nft)
    return {
        sellURC721,
        sellURC1155,
        cancelSellURC721,
        cancelSellURC1155,
        approvalSellForAllURC721,
        approvalSellForAllURC1155,
        approvalSellForSingleURC721,
    }
}