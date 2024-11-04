import { NFT } from "@/types";
import { Address } from "abitype";
import { contracts } from "@/config/contracts";
import { parseEther } from "ethers";
import { Web3Functions } from "@/services/web3";

export const useBidURC721UsingNative = (nft: NFT) => {
  const onBidERC721 = async (price: any, value: any) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc721Market.abi,
        address: contracts.erc721Market.address,
        functionName: "createBidUsingEth",
        args: [
          nft.collection.address,
          (nft.u2uId ? nft.u2uId : nft.id) as any,
          price,
        ],
        value,
      });
      return response.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };

  const onBidURC721UsingNative = async (price: any) => {
    const totalPrice = parseEther(price);
    const [_, buyerFee] = await Web3Functions.readContract({
      abi: contracts.feeDistributorContract.abi,
      address: contracts.feeDistributorContract.address,
      functionName: "calculateFee",
      args: [totalPrice, nft.collection.address, (nft.u2uId || nft.id) as any],
    });

    const totalCost = totalPrice + buyerFee;
    try {
      const hash = await onBidERC721(totalPrice, totalCost);
      return hash;
    } catch (err) {
      throw err;
    }
  };
  return onBidURC721UsingNative;
};

export const useBidURC1155UsingNative = (nft: NFT) => {
  const onBidERC1155 = async (pricePerUnit: any, quantity: any, value: any) => {
    try {
      const response = await Web3Functions.writeContract({
        ...contracts.erc1155Market,
        functionName: "createOfferUsingEth",
        args: [
          nft.collection.address,
          (nft.u2uId ? nft.u2uId : nft.id) as any,
          quantity,
          pricePerUnit,
        ],
        value,
      });
      return response.transactionHash;
    } catch (err) {
      throw err;
    }
  };
  const onBidURC1155UsingNative = async (price: string, quantity: any) => {
    const totalPrice = parseEther(price) * BigInt(quantity ?? 0);
    const pricePerUnit = parseEther(price);
    const [_, buyerFee] = await Web3Functions.readContract({
      abi: contracts.feeDistributorContract.abi,
      address: contracts.feeDistributorContract.address,
      functionName: "calculateFee",
      args: [totalPrice, nft.collection.address, (nft.u2uId || nft.id) as any],
    });
    const totalCost = totalPrice + buyerFee;
    try {
      const response = await onBidERC1155(pricePerUnit, quantity, totalCost);
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  return onBidURC1155UsingNative;
};

export const useBidURC721UsingURC20 = (nft: NFT) => {
  const onBidURC721UsingURC20 = async (price: any, quoteToken: Address) => {
    const response = await Web3Functions.writeContract({
      abi: contracts.erc721Market.abi,
      address: contracts.erc721Market.address,
      functionName: "createBid",
      args: [
        nft.collection.address,
        (nft.u2uId ? nft.u2uId : nft.id) as any,
        quoteToken,
        parseEther(price),
      ],
    });
    return response.transactionHash;
  };
  return onBidURC721UsingURC20;
};

export const useBidURC1155UsingURC20 = (nft: NFT) => {
  const onBidURC1155UsingURC20 = async (
    price: any,
    quoteToken: Address,
    quantity: string
  ) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc1155Market.abi,
        address: contracts.erc1155Market.address,
        functionName: "createOffer",
        args: [
          nft.collection.address,
          (nft.u2uId ? nft.u2uId : nft.id) as any,
          quantity as any,
          quoteToken,
          parseEther(price),
        ],
      });
      return response.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };
  return onBidURC1155UsingURC20;
};

export const useCancelBidURC721 = (nft: NFT) => {
  const onCancelBidURC721 = async () => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc721Market.abi,
        address: contracts.erc721Market.address,
        functionName: "cancelBid",
        args: [nft.collection.address, (nft.u2uId ? nft.u2uId : nft.id) as any],
        value: BigInt(0) as any,
      });
      return response.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };
  return onCancelBidURC721;
};

export const useCancelBidURC1155 = () => {
  const onCancelBidURC1155 = async (operationId?: string) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc1155Market.abi,
        address: contracts.erc1155Market.address,
        functionName: "cancelOffer",
        args: [operationId as any],
        value: BigInt(0) as any,
      });
      return response.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };
  return onCancelBidURC1155;
};

export const useAcceptBidURC721 = (nft: NFT) => {
  const onAcceptBidURC721 = async (bidder: Address, quoteToken: Address) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc721Market.abi,
        address: contracts.erc721Market.address,
        functionName: "acceptBid",
        args: [
          nft.collection.address,
          nft.u2uId ? BigInt(nft.u2uId) : BigInt(nft.id),
          bidder,
          quoteToken,
        ],
      });
      return response.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };
  return onAcceptBidURC721;
};

export const useAcceptBidURC1155 = () => {
  const onAcceptBidURC1155 = async (offerId: string, quantity: number) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: contracts.erc1155Market.abi,
        address: contracts.erc1155Market.address,
        functionName: "acceptOffer",
        args: [BigInt(offerId), BigInt(quantity)],
      });
      return response.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };
  return onAcceptBidURC1155;
};

export const useBidNFT = (nft: NFT) => {
  const bidURC721UsingNative = useBidURC721UsingNative(nft);
  const bidURC1155UsingNative = useBidURC1155UsingNative(nft);
  const bidURC721UsingURC20 = useBidURC721UsingURC20(nft);
  const bidURC1155UsingURC20 = useBidURC1155UsingURC20(nft);
  const cancelBidURC721UsingURC20 = useCancelBidURC721(nft);
  const cancelBidURC1155UsingURC20 = useCancelBidURC1155();
  const acceptBidURC721UsingURC20 = useAcceptBidURC721(nft);
  const acceptBidURC1155UsingURC20 = useAcceptBidURC1155();

  return {
    bidURC721UsingNative,
    bidURC1155UsingNative,
    bidURC721UsingURC20,
    bidURC1155UsingURC20,
    cancelBidURC721UsingURC20,
    cancelBidURC1155UsingURC20,
    acceptBidURC721UsingURC20,
    acceptBidURC1155UsingURC20,
  };
};
