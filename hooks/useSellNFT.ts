import { contracts } from "@/config/contracts";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { NFT } from "@/types";
import { parseEther } from "ethers";
import { Address } from "wagmi";


export const useSellURC721 = (nft: NFT) => {
  return async (price: number, quoteToken: Address) => {
    const { hash } = await writeContract({
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
    return waitForTransaction({ hash });
  };
};

export const useSellURC1155 = (nft: NFT) => {
  return async (
      price: number,
      quoteToken: Address,
      quantity: any,
  ) => {
    const { hash } = await writeContract({
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
    return waitForTransaction({ hash });
  };
};

export const useCancelSellURC721 = (nft: NFT) => {
  return async () => {
    const { hash } = await writeContract({
      abi: contracts.erc721Market.abi,
      address: contracts.erc721Market.address,
      functionName: "cancelAsk",
      args: [nft.collection.address, nft.u2uId ? BigInt(nft.u2uId) : BigInt(nft.id),
      ],
    });
    return waitForTransaction({ hash });
  };
};

export const useCancelSellURC1155 = () => {
  return async (operationId: string) => {
    const { hash } = await writeContract({
      abi: contracts.erc1155Market.abi,
      address: contracts.erc1155Market.address,
      functionName: "cancelAsk",
      args: [BigInt(operationId)],
    });
    return waitForTransaction({ hash });
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
