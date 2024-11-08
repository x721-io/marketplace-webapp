"use client";

import { useParams, useRouter } from "next/navigation";
import Text from "@/components/Text";
import NFTData from "@/components/NFT/NFTData";
import NFTMarketData from "@/components/Pages/MarketplaceNFT/NFTDetails/MarketData";
import NFTImage from "@/components/Pages/MarketplaceNFT/NFTDetails/NFTImage";
import Icon from "@/components/Icon";
import React from "react";
import { useGetMarketDataByNftId, useGetNftMetadata } from "@/hooks/useQuery";
import { NFT } from "@/types";

export default function NFTView({ item }: { item: NFT }) {
  const router = useRouter();
  const { id, collectionAddress } = useParams();

  const { data: marketData, isLoading: isLoadingMarketData } =
    useGetMarketDataByNftId(collectionAddress as string, id as string);

  const { data: metaData, isLoading: isLoadingMetadata } =
    useGetNftMetadata(item);

  if (!item) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <Text variant="heading-xs">Item not found!</Text>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="desktop:px-[100px] px-4 tablet:py-[60px] py-6 flex flex-col desktop:w-auto tablet:w-[646px] w-full justify-center">
        <div className="flex desktop:gap-16 tablet:gap-8 gap-8 desktop:flex-row flex-col items-center w-full tablet:items-start">
          <div className="flex gap-4 justify-center flex-col tablet:flex-row w-full tablet:w-auto">
            <div
              className="w-10 h-10 flex justify-center items-center rounded-[42px] bg-surface-soft shadow hover:shadow-md"
              onClick={router.back}
            >
              <Icon
                className="cursor-pointer"
                name="arrowLeft"
                width={20}
                height={20}
              />
            </div>
            <NFTImage item={item} />
          </div>
          <NFTMarketData
            nft={item}
            marketData={marketData}
            isLoading={isLoadingMarketData}
          />
        </div>
        <div className="flex mt-[34px] desktop:w-[700px] tablet:w-full desktop:pl-14">
          <NFTData
            marketData={marketData}
            nft={item}
            metaData={metaData}
            isLoadingMetadata={isLoadingMetadata}
          />
        </div>
      </div>
    </div>
  );
}
