"use client";

import { useParams, useRouter } from "next/navigation";
import Text from "@/components/Text";
import NFTData from "@/components/NFT/NFTData";
import NFTMarketData from "@/components/Pages/MarketplaceNFT/NFTDetails/MarketData";
import NFTImage from "@/components/Pages/MarketplaceNFT/NFTDetails/NFTImage";
import Icon from "@/components/Icon";
import { isMobile } from "react-device-detect";
import React from "react";
import {
  useGetMarketDataByNftId,
  useGetNftMetadata,
  useGetNFTs,
} from "@/hooks/useQuery";
import { NFT } from "@/types";
import NFTCard from "@/components/NFT/NFTCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { classNames } from "@/utils/string";

export default function NFTView({ item }: { item: NFT }) {
  const showFilters = false;
  const router = useRouter();
  const { id, collectionAddress } = useParams();
  const {
    data,
    isLoading: isLoadingRelatedNfts,
    size,
    setSize,
  } = useGetNFTs({
    collectionAddress: item.collection.address,
    limit: 5,
  });

  const { isLoadingMore, list: relatedItems } = useInfiniteScroll({
    data,
    loading: isLoadingRelatedNfts,
    page: size,
    onNext: () => {},
  });

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
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-center items-center">
        <div className="tablet:py-[60px] py-6 flex flex-col desktop:w-[80%] desktop:mx-auto tablet:w-[646px] w-full justify-center">
          <div className="flex desktop:gap-16 tablet:gap-8 gap-8 desktop:flex-row flex-col items-center w-full tablet:items-start">
            <div className="flex flex-col w-full gap-10">
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
              <div className="flex w-full">
                <NFTData
                  marketData={marketData}
                  nft={item}
                  metaData={metaData}
                  isLoadingMetadata={isLoadingMetadata}
                />
              </div>
            </div>
            <div className="w-full pr-10">
              <NFTMarketData
                nft={item}
                marketData={marketData}
                isLoading={isLoadingMarketData}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="tablet:py-[60px] py-6 flex flex-col desktop:w-[80%] gap-5 desktop:mx-auto tablet:w-[646px] w-full justify-center">
        <div className="w-full text-[1.25rem]">More From This Collection</div>
        <div
          className={classNames(
            "grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:gap-3 tablet:gap-4 gap-3",
            isMobile
              ? "desktop:grid-cols-5 tablet:grid-cols-3 grid-cols-2"
              : showFilters
              ? "desktop:grid-cols-4 tablet:grid-cols-2 grid-cols-1"
              : "desktop:grid-cols-5 tablet:grid-cols-3 grid-cols-2"
          )}
        >
          {!isLoadingRelatedNfts &&
            relatedItems.concatenatedData?.length > 0 &&
            relatedItems.concatenatedData.map((nft, i) => (
              <NFTCard {...nft} key={i} />
            ))}
        </div>
      </div>
    </div>
  );
}
