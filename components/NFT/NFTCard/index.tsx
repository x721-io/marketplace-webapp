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
import { NFT } from "@/types";
import { findTokenByAddress } from "@/utils/token";
import Icon from "@/components/Icon";
import { convertImageUrl } from "@/utils/nft";
import BlurImage from "@/components/X721UIKits/BlurImage";
import { useNFTFilterStore } from "@/store/filters/items/store";
import Button from "@/components/Button";
import { useUserStore } from "@/store/users/store";

type Props = {
  nft: NFT;
  canAddBulkList?: boolean;
};

export default function NFTCard({ nft, canAddBulkList = false }: Props) {
  const {
    name,
    id,
    price,
    sellStatus,
    collection,
    image,
    animationUrl,
    quoteToken,
    creator,
  } = nft;
  const { addToBulkList } = useUserStore();
  const gridMode = useNFTFilterStore((state) => state.gridMode);
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
        if (gridMode == 1) {
          return (
            <BlurImage
              className="cursor-pointer rounded-xl object-cover w-full desktop:h-[320px] tablet:h-[180px]"
              src={displayMedia}
              alt="image"
              width={220}
              height={220}
            />
          );
        } else {
          return (
            <BlurImage
              className="cursor-pointer rounded-xl object-cover w-full desktop:h-[200px] tablet:h-[180px]"
              src={displayMedia}
              alt="image"
              width={220}
              height={220}
            />
          );
        }
    }
  };

  const renderNFTData = () => {
    switch (sellStatus) {
      case "Bid":
        return (
          <Text className="text-body-12 px-1 text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
            Current bid:{" "}
            <span className="text-primary font-semibold">
              {formatDisplayedNumber(
                formatUnits(price as string, token?.decimal)
              )}
            </span>{" "}
            {token?.symbol}
          </Text>
        );
      case "AskNew":
        return (
          <Text className="text-body-12 px-4 py-2 rounded-lg bg-surface-soft text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
            On sale for:{" "}
            <span className="text-primary font-semibold">
              {formatDisplayedNumber(
                formatUnits(price as string, token?.decimal)
              )}
            </span>{" "}
            {token?.symbol}
          </Text>
        );
      default:
        return (
          <Text className="text-body-12 px-1 text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
            No bid yet
          </Text>
        );
    }
  };

  return (
    <Link
      key={id}
      href={`/item/${collection.address}/${id}`}
      className={
        "h-full flex flex-col rounded-xl px-2 py-2 gap-2 border border-1 hover:shadow-md border-surface transition-all relative"
      }
    >
      <Button onClick={() => addToBulkList(item)} className="absolute right-0">
        Add
      </Button>
      {renderMedia()}
      <div className="flex gap-1 items-center px-1">
        <Text className="text-black text-[1.05rem] py-2 font-bold whitespace-nowrap text-ellipsis overflow-hidden">
          {name}
        </Text>
        {creator?.accountStatus && collection?.isVerified ? (
          <Icon name="verified" width={16} height={16} />
        ) : (
          <Icon name="verify-disable" width={16} height={16} />
        )}
      </div>

      {renderNFTData()}
    </Link>
  );
}
