"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Text from "@/components/Text";
import { formatUnits } from "ethers";
import Link from "next/link";
import {
  ADDRESS_ZERO,
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
} from "@/config/constants";
import { formatDisplayedNumber } from "@/utils";
import { NFT } from "@/types";
import { findTokenByAddress } from "@/utils/token";
import Icon from "@/components/Icon";
import { convertImageUrl } from "@/utils/nft";
import BlurImage from "@/components/X721UIKits/BlurImage";
import { useUserStore } from "@/store/users/store";
import { useGetMarketDataByNftId } from "@/hooks/useQuery";
import { useNFTMarketStatus } from "@/hooks/useMarket";
import { usePathname, useRouter } from "next/navigation";
import { Address } from "abitype";

export default function NFTCard(nft: NFT) {
  const router = useRouter();
  const pathName = usePathname();
  const { data: marketData } = useGetMarketDataByNftId(
    nft.collection.address as string,
    nft.id as string,
    pathName.startsWith("/user")
  );
  const { isOwner, isOnSale } = useNFTMarketStatus(
    nft.collection.type,
    marketData
  );
  const {
    name,
    id,
    price,
    collection,
    image,
    animationUrl,
    quoteToken,
    creator,
    sellInfo,
    bidInfo,
  } = nft;
  const { upsertBulkOrdersItem, removeBulkOrdersItem, bulkOrders } =
    useUserStore();
  const displayMedia = convertImageUrl(image || animationUrl);
  const fileExtension = displayMedia.split(".").pop();
  const token = useMemo(() => findTokenByAddress(quoteToken), [quoteToken]);
  const fileType = useMemo(() => {
    if (!fileExtension) return "image";

    switch (true) {
      case ALLOWED_AUDIO_TYPES.includes(fileExtension):
        return "audio";
      case ALLOWED_VIDEO_TYPES.includes(fileExtension):
        return "video";
      case ALLOWED_IMAGE_TYPES.includes(fileExtension):
        return "image";
      default:
        return "image";
    }
  }, [fileExtension]);

  const renderMedia = () => {
    switch (fileType) {
      case "audio":
        return (
          <div className="relative w-full h-[220px] rounded-2xl bg-black flex justify-center items-end p-2">
            <Image
              className="cursor-pointer rounded-xl object-cover w-full h-full"
              src={image}
              alt="image"
              width={220}
              height={220}
              loading="lazy"
            />
            <audio className="absolute bottom-0 w-full h-[25px]" controls>
              <source
                src={animationUrl}
                type={`${fileType}/${fileExtension}`}
              />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      case "video":
        return (
          <video className="w-full h-[220px] rounded-2xl" controls>
            <source src={displayMedia} type={`${fileType}/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        );
      case "image":
        return (
          <BlurImage
            className="cursor-pointer rounded-xl object-cover w-full desktop:h-[220px] tablet:h-[180px] h-[130px] "
            src={displayMedia}
            alt="image"
            width={220}
            height={220}
          />
        );
    }
  };

  const renderNFTData = () => {
    // switch (orderStatus) {
    //   case "Bid":
    //     return (
    //       <Text className="text-body-12 px-1 text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
    //         Current bid:{" "}
    //         <span className="text-primary font-semibold">
    //           {formatDisplayedNumber(
    //             formatUnits(price as string, token?.decimal)
    //           )}
    //         </span>{" "}
    //         {token?.symbol}
    //       </Text>
    //     );
    //   case "AskNew":
    //     return (
    //       <Text className="text-body-12 px-1 text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
    //         On sale for:{" "}
    //         <span className="text-primary font-semibold">
    //           {formatDisplayedNumber(
    //             formatUnits(price as string, token?.decimal)
    //           )}
    //         </span>{" "}
    //         {token?.symbol}
    //       </Text>
    //     );
    //   default:
    //     return (
    //       <Text className="text-body-12 px-1 text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
    //         No bid yet
    //       </Text>
    //     );
    // }
    return (
      <div className="w-full flex desktop:flex-row flex-col items-center justify-between text-[0.9rem] pt-2 pb-2 px-1 gap-2">
        <div className="flex flex-col w-full">
          <div>Price</div>
          <div>
            {sellInfo
              ? `${formatUnits(sellInfo.price, 18)} ${
                  findTokenByAddress(sellInfo.quoteToken as any)?.symbol ??
                  "U2U"
                }`
              : "None"}
          </div>
        </div>
        <div className="flex flex-col desktop:text-right text-left w-full">
          <div>Highest bid</div>
          <div>
            {bidInfo
              ? `${formatUnits(bidInfo.price, 18)} ${
                  findTokenByAddress(bidInfo.quoteToken as any)?.symbol ?? "U2U"
                }`
              : "No bids yet"}
          </div>
        </div>
      </div>
    );
  };

  const getOrderItemIndex = () => {
    const index = bulkOrders.findIndex(
      (o) => o.nft?.id === nft.id && o.nft.collectionId === nft.collectionId
    );
    return index;
  };

  return (
    <div className="group cursor-pointer relative overflow-hidden">
      {1 !== 1 && isOwner && !isOnSale && pathName.startsWith("/user") && (
        <div
          onClick={() => router.push(`/item/${collection.address}/${id}`)}
          className="absolute top-0 left-0 z-10 w-full h-full rounded-md px-3 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <button
            style={{
              background: getOrderItemIndex() !== -1 ? "#9E9E9E" : "#1E88E5",
            }}
            className="rounded-full w-[30px] h-[30px] outline-none border-none text-[white] shadow-xl"
            onClick={(e) => {
              e.stopPropagation();
              const index = getOrderItemIndex();
              if (index !== -1) {
                removeBulkOrdersItem(index);
              } else {
                upsertBulkOrdersItem({
                  nft: nft,
                  price: 0,
                  quantity: 1,
                  daysRange: "30_DAYS",
                  end: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
                  start: new Date().getTime(),
                  netPrice: 0,
                  totalPrice: 0,
                  quoteToken: ADDRESS_ZERO,
                  salt: "0",
                });
              }
            }}
          >
            {getOrderItemIndex() !== -1 ? "-" : "+"}
          </button>
        </div>
      )}
      <Link
        key={id}
        href={`/item/${collection.address}/${id}`}
        style={{
          borderColor:
            getOrderItemIndex() !== -1 && pathName.startsWith("/user")
              ? "#1E88E5"
              : "#ebeaea",
          borderWidth: "2px",
        }}
        className={
          "h-full flex flex-col rounded-xl p-2 gap-2 border border-1 hover:shadow-md transition-all"
        }
      >
        {/* {profile?.signer === } */}
        {renderMedia()}
        <div className="flex gap-1 items-center px-1">
          <Text className="text-secondary text-body-12">{name}</Text>
          {creator?.accountStatus && collection?.isVerified ? (
            <Icon name="verified" width={16} height={16} />
          ) : (
            <Icon name="verify-disable" width={16} height={16} />
          )}
        </div>

        {renderNFTData()}
      </Link>
    </div>
  );
}
