import { APIResponse } from "@/services/api/types";
import {
  Address,
  erc20ABI,
  useContractRead,
  useContractReads,
  useContractWrite,
} from "wagmi";
import { useMemo } from "react";
import { contracts } from "@/config/contracts";
import useAuthStore from "@/store/auth/store";
import { AssetType, NFT } from "@/types";
import { useTransactionStatus } from "@/hooks/useTransactionStatus";
import { BigNumberish, MaxInt256, parseEther } from "ethers";
import { FINGERPRINT } from "@/config/constants";
import { readContract, waitForTransaction, writeContract } from "@wagmi/core";

export const useNFTMarketStatus = (
  type: AssetType,
  marketData?: APIResponse.NFTMarketData,
) => {
  const { owners, sellInfo, bidInfo } = useMemo(
    () =>
      marketData || {
        owners: [],
        sellInfo: [],
        bidInfo: [],
        totalSupply: 0,
      },
    [marketData],
  );
  const userId = useAuthStore((state) => state.profile?.id);
  const wallet = useAuthStore((state) => state.profile?.publicKey);

  const isOwner = useMemo(() => {
    if (!wallet) return false;
    return owners.some((owner) => owner.publicKey === wallet);
  }, [userId, owners, wallet]);

  const isOnSale = useMemo(() => {
    return !!sellInfo?.length;
  }, [sellInfo]);

  const hasBidder = useMemo(() => !!bidInfo?.length, [bidInfo]);

  const isBidder = useMemo(() => {
    if (!bidInfo || !wallet) return false;
    return bidInfo?.some(
      (bid) => bid.to?.signer?.toLowerCase() === wallet?.toLowerCase(),
    );
  }, [bidInfo]);

  const saleData = useMemo(() => {
    if (!sellInfo?.length) return undefined;
    if (type === "ERC721") {
      return sellInfo[0];
    }
    if (type === "ERC1155") {
      // Find the lowest price in sell data
      return sellInfo?.reduce((prev, curr) => {
        return parseEther(String(prev.price)) < parseEther(String(curr.price))
          ? prev
          : curr;
      });
    }
  }, [sellInfo]);

  const isSeller = useMemo(() => {
    if (type === "ERC721") return isOwner;
    return sellInfo.some((item) => {
      if (!wallet || !item.from?.signer) return false;
      return item.from.signer.toLowerCase() === wallet.toLowerCase();
    });
  }, [type, isOwner, sellInfo, wallet]);

  return {
    saleData,
    isOwner,
    isOnSale,
    hasBidder,
    isBidder,
    isSeller,
  };
};

export const useMarketApproval = (nft: NFT) => {
  const type = nft.collection.type;
  const marketContract =
    type === "ERC721" ? contracts.erc721Market : contracts.erc1155Market;
  const wallet = useAuthStore((state) => state.profile?.publicKey);

  const { data: isMarketContractApproved } = useContractRead({
    address: nft.collection.address,
    abi: (type === "ERC721"
      ? contracts.erc721Base.abi
      : contracts.erc1155Base.abi) as any,
    functionName: "isApprovedForAll",
    args: [wallet as Address, marketContract.address],
    enabled: !!wallet,
  });

  const {
    isLoading: isFetchingApproval,
    writeAsync: onApproveMarketContract,
    error: contractCallError,
  } = useContractWrite({
    address: nft.collection.address,
    abi: (type === "ERC721"
      ? contracts.erc721Base.abi
      : contracts.erc1155Base.abi) as any,
    functionName: "setApprovalForAll",
    args: [marketContract.address, true],
    value: BigInt(0) as any,
  });

  return {
    isMarketContractApproved,
    onApproveMarketContract,
    isFetchingApproval,
    contractCallError,
  };
};

export const useMarketTokenApproval = (token: Address, type: AssetType) => {
  const wallet = useAuthStore((state) => state.profile?.publicKey);
  const marketContract =
    type === "ERC721" ? contracts.erc721Market : contracts.erc1155Market;
  const { txStatus, updateHash } = useTransactionStatus();

  const { data: allowance, isLoading: isFetchingApproval } = useContractRead({
    address: token,
    abi: erc20ABI,
    functionName: "allowance",
    args: [wallet as Address, marketContract.address],
    enabled: !!wallet && !!token,
  });

  const isTokenApproved = useMemo(() => {
    if (!allowance) return false;
    return allowance > BigInt(0);
  }, [allowance]);

  const onApproveToken = async (price: bigint) => {
    console.log('price: ', price);
    await writeContract({
      abi: erc20ABI,
      address: token,
      functionName: 'approve',
      args: [marketContract.address, price],
    })
  };
  return {
    isTokenApproved,
    onApproveToken,
    isFetchingApproval,
    ...txStatus,
  };
};

const useWriteMarketContract = (type: AssetType, functionName: string) => {
  const marketContract =
    type === "ERC721" ? contracts.erc721Market : contracts.erc1155Market;

  return useContractWrite({
    ...marketContract,
    // @ts-ignore
    functionName,
  });
};

export const useSellNFT = (nft: NFT) => {
  const type = nft.collection.type;
  const { txStatus, updateHash } = useTransactionStatus();
  const { writeAsync, error: writeError } = useWriteMarketContract(
    type,
    "createAsk",
  );

  const onSellNFT = async (
    price: number,
    quoteToken: Address,
    quantity?: number,
  ) => {
    const args = [
      nft.collection.address,
      nft.u2uId ?? nft.id,
      type === "ERC1155" && quantity,
      quoteToken,
      parseEther(String(price)),
    ].filter(Boolean);
    const { hash } = await writeAsync?.({
      args,
      value: BigInt(0) as any,
    });
    updateHash(hash);
  };

  return { onSellNFT, writeError, ...txStatus };
};

export const useCancelSellNFT = (nft: NFT) => {
  const type = nft.collection.type;
  const { txStatus, updateHash } = useTransactionStatus();
  const { writeAsync, error: writeError } = useWriteMarketContract(
    type,
    "cancelAsk",
  );

  const onCancelSell = async (operationId?: string) => {
    const args =
      type === "ERC721"
        ? [nft.collection.address, nft.u2uId ?? nft.id]
        : [operationId];
    const { hash } = await writeAsync?.({
      args,
      value: BigInt(0) as any,
    });
    updateHash(hash);
  };

  return { onCancelSell, writeError, ...txStatus };
};

export const useBuyNFT = (nft: NFT) => {
  const { txStatus, updateHash } = useTransactionStatus();
  const { writeAsync, error: writeError } = useWriteMarketContract(
    nft.collection.type,
    "buy",
  );

  const onBuyERC721 = async (quoteToken: Address, price: BigNumberish) => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.u2uId ?? nft.id, quoteToken, price],
    });
    updateHash(hash);
  };

  const onBuyERC1155 = async (operationId: string, quantity: string) => {
    const { hash } = await writeAsync?.({
      args: [operationId, quantity],
      value: BigInt(0) as any,
    });
    updateHash(hash);
  };

  return { onBuyERC721, onBuyERC1155, writeError, ...txStatus };
};

export const useBuyUsingNative = (nft: NFT) => {
  const { txStatus, updateHash } = useTransactionStatus();
  const { writeAsync, error: writeError } = useWriteMarketContract(
    nft.collection.type,
    "buyUsingEth",
  );

  const onBuyERC721 = async (price: BigNumberish) => {
    const [_, buyerFee] = await readContract({
      ...contracts.feeDistributorContract,
      functionName: "calculateFee",
      args: [
        price as bigint,
        nft.collection.address,
        (nft.u2uId || nft.id) as any,
      ],
    });
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.u2uId ?? nft.id],
      value: BigInt(price) + buyerFee,
    });
    updateHash(hash);
  };

  const onBuyERC1155 = async (
    operationId: string,
    price: BigNumberish,
    quantity: number,
  ) => {
    const totalPrice = BigInt(price) * BigInt(quantity);

    const [_, buyerFee] = await readContract({
      ...contracts.feeDistributorContract,
      functionName: "calculateFee",
      args: [totalPrice, nft.collection.address, (nft.u2uId || nft.id) as any],
    });

    const { hash } = await writeAsync?.({
      args: [operationId, quantity],
      value: totalPrice + buyerFee,
    });
    updateHash(hash);
  };

  return { onBuyERC721, onBuyERC1155, writeError, ...txStatus };
};

export const useBidNFT = (nft: NFT) => {
  const type = nft.collection.type;
  const { txStatus, updateHash } = useTransactionStatus();

  const onBidERC721 = (price: any, quoteToken: Address) =>
    writeContract({
      ...contracts.erc721Market,
      functionName: "createBid",
      args: [nft.collection.address, (nft.u2uId ?? nft.id) as any, quoteToken, parseEther(price)]
    });

  const onBidERC1155 = (price: any, quoteToken: Address, quantity: string) =>
    writeContract({
      ...contracts.erc1155Market,
      functionName: "createOffer",
      args: [nft.collection.address, (nft.u2uId ?? nft.id) as any, quantity as any, quoteToken, parseEther(price)]
    });
                
  const onBidNFT = async (price: string, quoteToken: Address, quantity?: string,) => {
    const { hash } =
      type === "ERC721"
        ? await onBidERC721(price, quoteToken)
        : await onBidERC1155(price, quoteToken, quantity as any);
    updateHash(hash);
  };
  return { onBidNFT, ...txStatus };
};

export const useBidUsingNative = (nft: NFT) => {
  const type = nft.collection.type;
  const { txStatus, updateHash } = useTransactionStatus();

  const onBidERC721 = (price: any, value: any) =>
    writeContract({
      ...contracts.erc721Market,
      functionName: "createBidUsingEth",
      args: [nft.collection.address, (nft.u2uId ?? nft.id) as any, price],
      value,
    });

  const onBidERC1155 = (pricePerUnit: any, quantity: any, value: any) =>
    writeContract({
      ...contracts.erc1155Market,
      functionName: "createOfferUsingEth",
      args: [
        nft.collection.address,
        (nft.u2uId ?? nft.id) as any,
        quantity,
        pricePerUnit,
      ],
      value,
    });

  const onBidUsingNative = async (price: string, quantity?: string) => {
    const totalPrice =
      type === "ERC721"
        ? parseEther(price)
        : parseEther(price) * BigInt(quantity ?? 0);
    const pricePerUnit = parseEther(price);

    const [_, buyerFee] = await readContract({
      ...contracts.feeDistributorContract,
      functionName: "calculateFee",
      args: [totalPrice, nft.collection.address, (nft.u2uId || nft.id) as any],
    });

    const totalCost = totalPrice + buyerFee;

    const { hash } =
      type === "ERC721"
        ? await onBidERC721(totalPrice, totalCost)
        : await onBidERC1155(pricePerUnit, quantity, totalCost);
    updateHash(hash);
  };
  return { onBidUsingNative, ...txStatus };
};

export const useCancelBidNFT = (nft: NFT) => {
  const type = nft.collection.type;
  const { txStatus, updateHash } = useTransactionStatus();

  const onCancelERC721Bid = () =>
    writeContract({
      ...contracts.erc721Market,
      functionName: "cancelBid",
      args: [nft.collection.address, (nft.u2uId ?? nft.id) as any],
      value: BigInt(0) as any,
    });

  const onCancelERC1155Bid = (operationId?: string) =>
    writeContract({
      ...contracts.erc1155Market,
      functionName: "cancelOffer",
      args: [operationId as any],
      value: BigInt(0) as any,
    });

  const onCancelBid = async (operationId?: string) => {
    const { hash } =
      type === "ERC721"
        ? await onCancelERC721Bid()
        : await onCancelERC1155Bid(operationId);
    return updateHash(hash);
  };

  return { onCancelBid, ...txStatus };
};

export const useAcceptBidNFT = (nft: NFT) => {
  const type = nft.collection.type;
  const { txStatus, updateHash } = useTransactionStatus();
  const { writeAsync, error: writeError } = useWriteMarketContract(
    type,
    type === "ERC721" ? "acceptBid" : "acceptOffer",
  );

  const onAcceptERC721Bid = async (bidder: Address, quoteToken: Address) => {
    const { hash } = await writeAsync?.({
      args: [nft.collection.address, nft.u2uId ?? nft.id, bidder, quoteToken],
    });
    updateHash(hash);
  };

  const onAcceptERC1155Bid = async (offerId: string, quantity: number) => {
    const { hash } = await writeAsync?.({
      args: [offerId, quantity],
      value: BigInt(0) as any,
    });
    updateHash(hash);
  };

  return { onAcceptERC721Bid, onAcceptERC1155Bid, writeError, ...txStatus };
};
