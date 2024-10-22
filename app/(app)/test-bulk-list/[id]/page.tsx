"use client";

import { ADDRESS_ZERO } from "@/config/constants";
import { useFetchNFTsByUser } from "@/hooks/useFetchNFTsByUser";
import { exchangeSignedDomain } from "@/hooks/useMarketplaceV2";
import { useGetProfile } from "@/hooks/useQuery";
import { nextAPI } from "@/services/api";
import { useFilterByUser } from "@/store/filters/byUser/store";
import { FormState, NFT } from "@/types";
import { convertToUTCDateTS, genRandomNumber } from "@/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useSignTypedData } from "wagmi";

const TestBulkList = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const { data: user, mutate } = useGetProfile(id as string);
  const [nfts, setNfts] = useState<FormState.SellNFT[]>([]);
  const { signTypedDataAsync } = useSignTypedData();
  const filterStore = useFilterByUser();
  const {
    isLoadingMore,
    isLoading,
    items,
    error,
    showFilters,
    filters,
    toggleFilter,
    resetFilters,
    updateFilters,
  } = useFetchNFTsByUser(user?.publicKey ?? ADDRESS_ZERO, "owned");

  useEffect(() => {
    const userAddress = user?.publicKey;
    if (!userAddress) return;
    if (!filterStore[userAddress]) {
      filterStore.createFiltersForUser(user?.publicKey);
      filterStore.updateFilters("created", userAddress, {
        creatorAddress: userAddress,
      });
      filterStore.updateFilters("owned", userAddress, { owner: userAddress });
      filterStore.updateFilters("onSale", userAddress, { owner: userAddress });
    }
  }, [filterStore, user?.publicKey]);

  const addToBulkList = (nft: NFT) => {
    const sellNftParams: FormState.SellNFT = {
      nft,
      daysRange: "30_DAYS",
      start: new Date().getTime(),
      end: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      netPrice: 10,
      price: 12,
      quantity: 1,  
      quoteToken: ADDRESS_ZERO,
      salt: genRandomNumber(8, 10),
      totalPrice: 13,
    };
    setNfts((nfts) => [...nfts, sellNftParams]);
  };

  const generateBulkData = async () => {
    if (!address) return false;
    const body = nfts
      .map((order, i) => {
        if (!order.nft) return null;
        const { collection } = order.nft;
        const { address: collectionAddress } = collection;
        const { end, price, quantity, quoteToken, start, salt } = order;
        const makeAsset = {
          assetType: 3,
          contractAddress: collectionAddress,
          value: BigInt(quantity).toString(),
          id: order.nft.u2uId ?? order.nft.id,
        };
        const takeAsset = {
          assetType: 1,
          contractAddress: quoteToken,
          value: parseUnits(order.totalPrice.toString(), 18),
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
        return {
          makeAssetType: make_asset_type,
          makeAssetId: make_asset_id.toString(),
          makeAssetAddress: make_asset_address,
          makeAssetValue: make_asset_value.toString(),
          taker: ADDRESS_ZERO,
          takeAssetType: take_asset_type,
          takeAssetAddress: take_asset_address,
          takeAssetValue: take_asset_value.toString(),
          takeAssetId: take_asset_id.toString(),
          salt: salt.toString(),
          start: Math.floor(start / 1000).toString(),
          end: Math.floor(end / 1000).toString(),
          orderType: "BULK",
          price: parseUnits(price.toString(), 18).toString(),
          totalPice: take_asset_value.toString(),
          netPrice: parseUnits(order.netPrice.toString(), 18).toString(),
          index: i,
          nft: order.nft,
          quantity: 1,
          quoteToken: ADDRESS_ZERO,
        };
      })
      .filter((item) => item !== null);
    const response = await nextAPI.post("/order/generate-bulk-data", {
      orders: body,
    });
    const types = {
      BulkOrder: [
        { name: "maker", type: "address" },
        { name: "root", type: "bytes32" },
      ],
    } as const;
    const sig = await signTypedDataAsync({
      account: address,
      domain: exchangeSignedDomain,
      types,
      primaryType: "BulkOrder",
      message: {
        maker: address,
        root: response.data.data.root,
      },
    });

    const body2 = body
      .map((order: any, i) => {
        const {
          makeAssetType,
          makeAssetId,
          makeAssetAddress,
          makeAssetValue,
          taker,
          takeAssetType,
          takeAssetAddress,
          takeAssetValue,
          takeAssetId,
          salt,
          start,
          end,
          orderType,
          price,
          totalPice,
          netPrice,
          index,
          nft,
          quantity,
          quoteToken,
        } = order;
        return {
          makeAssetType,
          makeAssetId,
          makeAssetAddress,
          makeAssetValue,
          taker,
          takeAssetType,
          takeAssetAddress,
          takeAssetValue,
          takeAssetId,
          salt,
          start,
          end,
          orderType,
          price,
          totalPice,
          netPrice,
          index,
          nft,
          quantity,
          quoteToken,
          sig,
          root: response.data.data.root,
          proof: response.data.data.proof[i],
        };
      })
      .filter((item) => item !== null);
    console.log({ body2 });
    await nextAPI.post("/order/bulk", { orders: body2 });
  };

  return (
    <div>
      {items.concatenatedData &&
        items.concatenatedData.map((item: NFT) => (
          <div key={item.u2uId}>
            {item.name} &nbsp; | &nbsp;{" "}
            <button onClick={() => addToBulkList(item)}>Add</button>
          </div>
        ))}
      <br />
      <div>Total: {nfts.length}</div>
      <button onClick={generateBulkData}>List all</button>
    </div>
  );
};

export default TestBulkList;
