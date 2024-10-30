"use client";

import { useParams, useRouter } from "next/navigation";
import Text from "@/components/Text";
import NFTData from "@/components/NFT/NFTData";
import NFTMarketData from "@/components/Pages/MarketplaceNFT/NFTDetails/MarketData";
import NFTImage from "@/components/Pages/MarketplaceNFT/NFTDetails/NFTImage";
import Icon from "@/components/Icon";
import React, { useEffect } from "react";
import { useGetMarketDataByNftId, useGetNftMetadata } from "@/hooks/useQuery";
import { NFT } from "@/types";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";

export default function NFTView({ item }: { item: NFT }) {
  const router = useRouter();
  const { id, collectionAddress } = useParams();
  // const { testAcceptBid } = useMarketplaceV2(item);
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
      <div className="desktop:px-[100px] px-4 tablet:py-[60px] py-6 flex flex-col desktop:w-[82%] tablet:w-[646px] w-full justify-center">
        <div className="flex justify-between desktop:flex-row flex-col items-center w-full tablet:items-start gap-16">
          <div className="flex gap-4 justify-center flex-col tablet:flex-row w-[60%]">
            {/* <div
              className="w-10 h-10 flex justify-center items-center rounded-[42px] bg-surface-soft shadow hover:shadow-md"
              onClick={router.back}
            >
              <Icon
                className="cursor-pointer"
                name="arrowLeft"
                width={20}
                height={20}
              />
            </div> */}
            <div className="w-[100%] aspect-square relative flex items-center justify-center">
              <NFTImage item={item} />
            </div>
          </div>
          <div className="sticky z-[10] left-0 flex-1 top-[40px]">
            <NFTMarketData
              nft={item}
              marketData={marketData}
              isLoading={isLoadingMarketData}
            />
          </div>
        </div>
        <div className="flex mt-[34px] desktop:w-[60%] tablet:w-full desktop:pl-0">
          <NFTData
            marketData={marketData}
            nft={item}
            metaData={metaData}
            isLoadingMetadata={isLoadingMetadata}
          />
        </div>
        {/* <button onClick={testAcceptBid}>Accept Biddd</button> */}
      </div>
    </div>
  );
}
