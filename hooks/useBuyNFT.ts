import { contracts } from "@/config/contracts";
import { readContract } from "@wagmi/core";
import { NFT } from "@/types";
import { Address } from "wagmi";
import { Web3Functions } from "@/services/web3";

export default function useBuyNFT({ nft }: { nft: NFT }) {
  const buyURC721UsingNative = async (price: any) => {
    try {
      const [_, buyerFee] = await readContract({
        ...contracts.feeDistributorContract,
        functionName: "calculateFee",
        args: [
          price as bigint,
          nft.collection.address,
          (nft.u2uId || nft.id) as any,
        ],
      });
      const response = await Web3Functions.writeContract({
        abi: contracts.erc721Market.abi,
        address: contracts.erc721Market.address,
        functionName: "buyUsingEth",
        args: [nft.collection.address, (nft.u2uId || nft.id) as any],
        value: BigInt(price) + buyerFee,
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  const buyURC1155UsingNative = async (
    operationId: string,
    price: any,
    quantity: number
  ) => {
    const totalPrice = BigInt(price) * BigInt(quantity);
    try {
      const [_, buyerFee] = await readContract({
        ...contracts.feeDistributorContract,
        functionName: "calculateFee",
        args: [
          totalPrice,
          nft.collection.address,
          (nft.u2uId || nft.id) as any,
        ],
      });

      const response = await Web3Functions.writeContract({
        abi: contracts.erc1155Market.abi,
        address: contracts.erc1155Market.address,
        functionName: "buyUsingEth",
        args: [BigInt(operationId), BigInt(quantity)],
        value: totalPrice + buyerFee,
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  const buyURC721UsingURC20 = async (quoteToken: Address, price: any) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc721Market.abi,
        address: contracts.erc721Market.address,
        functionName: "buy",
        args: [
          nft.collection.address,
          BigInt(nft.u2uId ?? nft.id),
          quoteToken,
          BigInt(price),
        ],
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  const buyURC1155UsingURC20 = async (
    operationId: string,
    quantity: number
  ) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc1155Market.abi,
        address: contracts.erc1155Market.address,
        functionName: "buy",
        args: [BigInt(operationId), BigInt(quantity)],
        value: BigInt(0) as any,
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    buyURC1155UsingNative,
    buyURC1155UsingURC20,
    buyURC721UsingNative,
    buyURC721UsingURC20,
  };
}
