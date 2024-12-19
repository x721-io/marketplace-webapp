"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Text from "@/components/Text";
import { formatUnits } from "ethers";
import Link from "next/link";
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
} from "@/config/constants";
import { formatDisplayedNumber } from "@/utils";
import { LayerGNFT } from "@/types";
import { findTokenByAddress } from "@/utils/token";
import Icon from "@/components/Icon";
import BlurImage from "@/components/X721UIKits/BlurImage";
import { Address } from "abitype";

export default function LayergNFTCard({
  name,
  id,
  sellInfo,
  bidInfo,
  collection,
  image,
  animationUrl,
  creator,
}: LayerGNFT) {
  const displayMedia = image || animationUrl;

  const fileExtension = displayMedia.split(".").pop();

  const token = useMemo(() => {
    const quoteToken = sellInfo?.quoteToken || bidInfo?.quoteToken;
    if (!quoteToken || Object.keys(quoteToken).length === 0) {
      return null;
    }
    return findTokenByAddress(quoteToken as Address);
  }, [sellInfo, bidInfo]);

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

  return (
    <Link
      key={id}
      href={`/item/${collection?.address}/${id}`}
      className={
        "h-full  w-full flex flex-col rounded-xl p-2 gap-2 border border-1 hover:shadow-md border-soft transition-all"
      }
    >
      {renderMedia()}
      <div className="flex gap-1 items-center px-1">
        <Text className="text-secondary text-body-12">{name}</Text>
        {creator?.accountStatus && collection?.isVerified ? (
          <Icon name="verified" width={16} height={16} />
        ) : (
          <Icon name="verify-disable" width={16} height={16} />
        )}
      </div>

      <div className="w-full flex items-center justify-between bg-surface-soft rounded-lg p-2">
        <div className=" flex flex-col gap-1">
          <p className="text-body-14  text-primary whitespace-nowrap overflow-hidden text-ellipsis">
            Price
          </p>
          {sellInfo ? (
            <p className="text-secondary font-semibold text-body-12">
              {formatDisplayedNumber(formatUnits(sellInfo?.price || 0, 18))}{" "}
              {token?.symbol}
            </p>
          ) : (
            <p className="text-secondary font-semibold text-body-12">
              Not for sale
            </p>
          )}
        </div>

        <div className=" flex flex-col gap-1">
          <p className="text-body-14 text-primary whitespace-nowrap overflow-hidden text-ellipsis">
            Highest bid
          </p>

          {!bidInfo || Object.keys(bidInfo).length === 0 ? (
            <p className="text-secondary font-semibold text-body-12">
              Not for sale
            </p>
          ) : (
            <p className="text-secondary text-right font-semibold text-body-12">
              {formatDisplayedNumber(formatUnits(bidInfo?.price || 0, 18))}{" "}
              {token?.symbol}
            </p>
          )}
        </div>
      </div>

      <div className="w-full ">
        <div className="flex w-full  bg-surface-soft border-b  border-b-[#E3E3E3] items-center justify-between p-2 rounded-t-lg text-body-12">
          <p className="text-tertiary ">Game</p>
          <div className="flex gap-1 items-center bg-surface-soft ">
            <p className=" ">{collection?.metadataJson?.name}</p>
            <div className="rounded">
              {collection?.metadataJson?.gameIcon && (
                <Image
                  src={collection?.metadataJson?.gameIcon}
                  alt={collection?.metadataJson?.name}
                  width={16}
                  height={16}
                  className="rounded"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full bg-surface-soft items-center justify-between p-2 rounded-b-lg text-body-12">
          <p className="text-tertiary ">Collection</p>
          <div className="flex gap-1 items-center ">
            <p className=" ">{collection?.name}</p>
            {collection?.avatar && (
              <Image
                src={collection?.avatar}
                alt={collection?.name || ""}
                width={16}
                height={16}
                className="rounded"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
