import { ADDRESS_ZERO } from "@/config/constants";
import { contracts } from "@/config/contracts";
import { APIResponse } from "@/services/api/types";
import { Web3Functions } from "@/services/web3";
import { FormState, NFT } from "@/types";
import { all } from "axios";
import { useState } from "react";
import {
  Address,
  encodeAbiParameters,
  formatEther,
  parseEther,
  parseUnits,
} from "viem";
import { erc20ABI, useAccount, useSignTypedData } from "wagmi";

export const contractNFTTransferProxy =
  "0x0f4aDd504070aA16eFb52777D7ab60CfE0EC8aE7";
export const contractERC20TransferProxy =
  "0x04893e14B9c943088e1a1420A516a68216009ab7";
export const contractWETHTest = "0xDD7Dc2bBeB8f6a9e60C09aCd8174e4FcFAef0647";
export const contractExchangeV2Test =
  "0x10b03e09f0A60634cA5889F7a5c26db60715CBC7";

const useMarketplaceV2 = (nft: NFT) => {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [isApproving, setApproving] = useState(false);
  const [isSigningOrderData, setIsSigningOrderData] = useState(false);
  const [isCreatingOrder, setCreatingOrder] = useState(false);

  const getCollectionType = (): "ERC721" | "ERC1155" | null => {
    if (nft.collection.type !== "ERC721" && nft.collection.type !== "ERC1155")
      return null;
    return nft.collection.type;
  };

  const checkIfApprovedForAll = async () => {
    if (!address) return false;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const type = getCollectionType();
    if (!type) return false;
    try {
      const isApproveForAll =
        type === "ERC721"
          ? await Web3Functions.readContract({
              abi: contracts.erc721Base.abi,
              functionName: "isApprovedForAll",
              address: collectionAddress,
              args: [address, contractNFTTransferProxy],
            })
          : await Web3Functions.readContract({
              abi: contracts.erc1155Base.abi,
              functionName: "isApprovedForAll",
              address: collectionAddress,
              args: [address, contractNFTTransferProxy],
            });
      return isApproveForAll;
    } catch (err) {
      return false;
    }
  };

  const getERC20Allowance = async (tokenAddress: Address) => {
    if (!address || !tokenAddress) return BigInt(0);
    try {
      const allowance = await Web3Functions.readContract({
        abi: erc20ABI,
        functionName: "allowance",
        address: tokenAddress,
        args: [address, contractERC20TransferProxy],
      });
      return BigInt(allowance.toString());
    } catch (err) {
      return BigInt(0);
    }
  };

  const approveERC20TokenAmt = async (
    tokenAddress: Address,
    amount: bigint
  ): Promise<boolean> => {
    if (!address || !tokenAddress) return false;
    try {
      await Web3Functions.writeContract({
        abi: erc20ABI,
        functionName: "approve",
        address: tokenAddress,
        args: [contractERC20TransferProxy, amount],
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  const a = async (tokenAddress: Address) => {
    if (!address || !tokenAddress) return BigInt(0);
    try {
      const allowance = await Web3Functions.readContract({
        abi: erc20ABI,
        functionName: "allowance",
        address: tokenAddress,
        args: [address, contractERC20TransferProxy],
      });
      return BigInt(allowance.toString());
    } catch (err) {
      return BigInt(0);
    }
  };

  const approveAll = async () => {
    if (!address) return false;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const type = getCollectionType();
    if (!type) return false;
    try {
      const result =
        type === "ERC721"
          ? await Web3Functions.writeContract({
              abi: contracts.erc721Base.abi,
              functionName: "setApprovalForAll",
              address: collectionAddress,
              args: [contractNFTTransferProxy, true],
            })
          : await Web3Functions.writeContract({
              abi: contracts.erc1155Base.abi,
              functionName: "setApprovalForAll",
              address: collectionAddress,
              args: [contractNFTTransferProxy, true],
            });
      return true;
    } catch (err: any) {
      return false;
    }
  };

  const getTokenAssetType = (tokenAddress: Address): 1 | 2 => {
    return tokenAddress === ADDRESS_ZERO ? 1 : 2;
  };

  const getNftAssetType = (): 3 | 4 => {
    return nft.collection.type === "ERC721" ? 3 : 4;
  };

  const getSellOrderEncodedData = (params: FormState.SellNFT) => {
    if (!address) return null;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { price, quantity, quoteToken } = params;
    const takeValue = parseUnits(price.toString(), 18);

    return encodeAbiParameters(
      [
        { name: "maker", type: "address" },
        { name: "makeAssetType", type: "uint8" },
        { name: "makeAssetContract", type: "address" },
        { name: "makeAssetValue", type: "uint256" },
        { name: "makeAssetId", type: "uint256" },
        { name: "taker", type: "address" },
        { name: "takeAssetType", type: "uint8" },
        { name: "takeAssetContract", type: "address" },
        { name: "takeAssetValue", type: "uint256" },
        { name: "takeAssetId", type: "uint256" },
      ],
      [
        address,
        getNftAssetType(),
        collectionAddress,
        BigInt(quantity),
        BigInt(nft.u2uId ?? nft.id),
        "0x0000000000000000000000000000000000000000",
        getTokenAssetType(quoteToken),
        quoteToken,
        takeValue,
        BigInt(0),
      ]
    );
  };

  const getBidOrderEncodedData = (
    params: FormState.BidNFT,
    nft: NFT,
    marketData: APIResponse.NFTMarketData
  ) => {
    if (!address) return null;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { price, quantity, quoteToken } = params;
    const takeValue = parseUnits(price.toString(), 18);

    return encodeAbiParameters(
      [
        { name: "maker", type: "address" },
        { name: "makeAssetType", type: "uint8" },
        { name: "makeAssetContract", type: "address" },
        { name: "makeAssetValue", type: "uint256" },
        { name: "makeAssetId", type: "uint256" },
        { name: "taker", type: "address" },
        { name: "takeAssetType", type: "uint8" },
        { name: "takeAssetContract", type: "address" },
        { name: "takeAssetValue", type: "uint256" },
        { name: "takeAssetId", type: "uint256" },
      ],
      [
        address,
        getTokenAssetType(quoteToken),
        quoteToken,
        takeValue,
        BigInt(0),
        marketData.owners[0].signer,
        getNftAssetType(),
        collectionAddress,
        BigInt(quantity),
        BigInt(nft.u2uId ?? nft.id),
      ]
    );
  };

  const signSellOrderData = async (params: FormState.SellNFT) => {
    if (!address) return null;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { price, quantity, quoteToken, start, end, salt } = params;
    const types = {
      Asset: [
        { name: "assetType", type: "uint8" },
        { name: "contractAddress", type: "address" },
        { name: "value", type: "uint256" },
        { name: "id", type: "uint256" },
      ],
      Fee: [
        { name: "receiver", type: "address" },
        { name: "amount", type: "uint96" },
      ],
      Order: [
        { name: "maker", type: "address" },
        { name: "makeAsset", type: "Asset" },
        { name: "taker", type: "address" },
        { name: "takeAsset", type: "Asset" },
        { name: "salt", type: "uint256" },
        { name: "start", type: "int256" },
        { name: "end", type: "int256" },
      ],
    } as const;

    const takeValue = parseUnits(price.toString(), 18);
    try {
      const sig = await signTypedDataAsync({
        account: address,
        domain: {
          chainId: 2484,
          name: "U2U",
          version: "1",
        },
        types,
        primaryType: "Order",
        message: {
          maker: address,
          makeAsset: {
            assetType: getNftAssetType(),
            contractAddress: collectionAddress,
            value: BigInt(quantity),
            id: BigInt(nft.u2uId ?? nft.id),
          },
          taker: "0x0000000000000000000000000000000000000000",
          takeAsset: {
            assetType: getTokenAssetType(quoteToken),
            contractAddress: quoteToken,
            value: takeValue,
            id: BigInt(0),
          },
          salt: BigInt(salt),
          start: BigInt(start),
          end: BigInt(end),
        },
      });
      return sig;
    } catch (err: any) {
      return null;
    }
  };

  const signBidOrderData = async (
    params: FormState.BidNFT,
    nft: NFT,
    marketData: APIResponse.NFTMarketData
  ) => {
    if (!address) return null;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { price, quantity, quoteToken, start, end, salt } = params;
    const types = {
      Asset: [
        { name: "assetType", type: "uint8" },
        { name: "contractAddress", type: "address" },
        { name: "value", type: "uint256" },
        { name: "id", type: "uint256" },
      ],
      Fee: [
        { name: "receiver", type: "address" },
        { name: "amount", type: "uint96" },
      ],
      Order: [
        { name: "maker", type: "address" },
        { name: "makeAsset", type: "Asset" },
        { name: "taker", type: "address" },
        { name: "takeAsset", type: "Asset" },
        { name: "salt", type: "uint256" },
        { name: "start", type: "int256" },
        { name: "end", type: "int256" },
      ],
    } as const;

    const takeValue = parseUnits(price.toString(), 18);
    const sig = await signTypedDataAsync({
      account: address,
      domain: {
        chainId: 2484,
        name: "U2U",
        version: "1",
      },
      types,
      primaryType: "Order",
      message: {
        maker: address,
        makeAsset: {
          assetType: getTokenAssetType(quoteToken),
          contractAddress: quoteToken,
          value: takeValue,
          id: BigInt(0),
        },
        taker: marketData.owners[0].signer,
        takeAsset: {
          assetType: getNftAssetType(),
          contractAddress: collectionAddress,
          value: BigInt(quantity),
          id: BigInt(nft.u2uId ?? nft.id),
        },
        salt: BigInt(salt),
        start: BigInt(start),
        end: BigInt(end),
      },
    });
    return sig;
  };

  const createOrderAPI = async (
    params: FormState.SellNFT | FormState.BidNFT,
    sig: `0x${string}`,
    encodedData: `0x${string}`,
    taker: Address,
    orderType: "BID" | "SELL"
  ) => {
    if (!address) return false;
    const { collection } = nft;
    const { address: collectionAddress } = collection;
    const { end, price, quantity, quoteToken, start, salt } = params;
    const takeValue = parseUnits(price.toString(), 18);
    const makeAsset = {
      assetType: getNftAssetType(),
      contractAddress: collectionAddress,
      value: BigInt(quantity).toString(),
      id: nft.u2uId ?? nft.id,
    };
    const takeAsset = {
      assetType: getTokenAssetType(quoteToken),
      contractAddress: quoteToken,
      value: takeValue.toString(),
      id: BigInt(0).toString(),
    };
    const {
      assetType: make_asset_type,
      contractAddress: make_asset_address,
      value: make_asset_value,
      id: make_asset_id,
    } = makeAsset;
    const {
      assetType: take_asset_type,
      contractAddress: take_asset_address,
      value: take_asset_value,
      id: take_asset_id,
    } = takeAsset;
    try {
      await fetch("http://localhost:3001/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maker: address,
          make_asset_type,
          make_asset_id,
          make_asset_address,
          make_asset_value,
          taker,
          take_asset_type,
          take_asset_address,
          take_asset_value,
          take_asset_id,
          salt,
          start: start.toString(),
          end: end.toString(),
          sig,
          type: orderType,
          data: encodedData,
        }),
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  const createSellOrder = async (
    params: FormState.SellNFT,
    onApproveSuccess: () => void,
    onSignSuccess: () => void,
    onCreateOrderAPISuccess: () => void,
    onRequestError: (
      requestType: "approve" | "sign" | "create_order_api",
      error: Error
    ) => void
  ): Promise<boolean> => {
    if (!address) return false;

    const isApproved = await checkIfApprovedForAll();
    if (!isApproved) {
      setApproving(true);
      const result = await approveAll();
      setApproving(false);
      if (!result) {
        onRequestError("approve", new Error("Failed to approve"));
        return false
      };
    }
    onApproveSuccess();

    const encodedData = getSellOrderEncodedData(params);
    if (!encodedData) return false;

    setIsSigningOrderData(true);
    const sig = await signSellOrderData(params);
    setIsSigningOrderData(false);
    if (!sig) {
      onRequestError("sign", new Error("Failed to sign order data"));
      return false;
    }
    onSignSuccess();

    setCreatingOrder(true);
    const result = true;
    // const result = await createOrderAPI(
    //   params,
    //   sig,
    //   encodedData,
    //   ADDRESS_ZERO,
    //   "SELL"
    // );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCreatingOrder(false);
    onCreateOrderAPISuccess();
    return result;
  };

  const createBidOrder = async (
    params: FormState.BidNFT,
    nft: NFT,
    marketData: APIResponse.NFTMarketData
  ): Promise<boolean> => {
    if (!address) return false;
    const { quoteToken, quantity, price } = params;
    const allowance = await getERC20Allowance(quoteToken);
    const priceFloat = parseFloat(price);
    const qtyFLoat = parseFloat(quantity ?? 1);
    const totalPrice = parseUnits((priceFloat * qtyFLoat + 5).toString(), 18);
    if (totalPrice < allowance) {
      setApproving(true);
      const result = await approveERC20TokenAmt(params.quoteToken, totalPrice);
      setApproving(false);
      if (!result) return false;
    }

    const encodedData = getBidOrderEncodedData(params, nft, marketData);
    if (!encodedData) return false;

    setIsSigningOrderData(true);
    const sig = await signBidOrderData(params, nft, marketData);
    setIsSigningOrderData(false);
    if (!sig) return false;

    setCreatingOrder(true);
    // const result = true;
    const result = await createOrderAPI(
      params,
      sig,
      encodedData,
      marketData.owners[0].signer,
      "BID"
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCreatingOrder(false);
    return result;
  };

  return {
    getERC20Allowance,
    createSellOrder,
    createBidOrder,
    approveAll,
    signSellOrderData,
    checkIfApprovedForAll,
    isApproving,
    isSigningOrderData,
    isCreatingOrder,
  };
};

export default useMarketplaceV2;
