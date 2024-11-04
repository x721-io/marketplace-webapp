import { contracts } from "@/config/contracts";
import { NFT } from "@/types";
import { parseEther } from "ethers";
import { Address } from "abitype";
import { Web3Functions } from "@/services/web3";

export const useSellURC721 = (nft: NFT) => {
  return async (price: number, quoteToken: Address) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc721Market.abi,
        address: contracts.erc721Market.address,
        functionName: "createAsk",
        args: [
          nft.collection.address,
          nft.u2uId ? BigInt(nft.u2uId) : BigInt(nft.id),
          quoteToken,
          parseEther(String(price)),
        ],
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  };
};

export const useSellURC1155 = (nft: NFT) => {
  return async (price: number, quoteToken: Address, quantity: any) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc1155Market.abi,
        address: contracts.erc1155Market.address,
        functionName: "createAsk",
        args: [
          nft.collection.address,
          nft.u2uId ? BigInt(nft.u2uId) : BigInt(nft.id),
          quantity,
          quoteToken,
          parseEther(String(price)),
        ],
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  };
};

export const useCancelSellURC721 = (nft: NFT) => {
  return async () => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc721Market.abi,
        address: contracts.erc721Market.address,
        functionName: "cancelAsk",
        args: [
          nft.collection.address,
          nft.u2uId ? BigInt(nft.u2uId) : BigInt(nft.id),
        ],
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  };
};

export const useCancelSellURC1155 = () => {
  return async (operationId: string) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc1155Market.abi,
        address: contracts.erc1155Market.address,
        functionName: "cancelAsk",
        args: [BigInt(operationId)],
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  };
};

export const useSellNFT = (nft: NFT) => {
  const sellURC721 = useSellURC721(nft);
  const sellURC1155 = useSellURC1155(nft);
  const cancelSellURC721 = useCancelSellURC721(nft);
  const cancelSellURC1155 = useCancelSellURC1155();
  return {
    sellURC721,
    sellURC1155,
    cancelSellURC721,
    cancelSellURC1155,
  };
};
