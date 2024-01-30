"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import VerifyIcon from "@/components/Icon/Verify";
import Text from "@/components/Text";
import { formatEther } from "ethers";
import Link from "next/link";
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
} from "@/config/constants";
import { formatDisplayedBalance } from "@/utils";
import { Tooltip } from "flowbite-react";
import { NFT } from "@/types";

export default function NFTCard({
  name,
  id,
  price,
  sellStatus,
  collection,
  image,
  animationUrl,
}: NFT) {
  const displayMedia = image || animationUrl;
  const fileExtension = displayMedia.split(".").pop();

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
  }, [displayMedia, fileExtension]);

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
          <Image
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
    switch (sellStatus) {
      case "Bid":
        return (
          <Text className="text-body-12 px-1 text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
            Current bid:{" "}
            <span className="text-primary font-semibold">
              {formatDisplayedBalance(formatEther(price as string), 2)}
            </span>{" "}
            U2U
          </Text>
        );
      case "AskNew":
        return (
          <Text className="text-body-12 px-1 text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
            On sale for:{" "}
            <span className="text-primary font-semibold">
              {formatDisplayedBalance(
                formatEther(price as string).toString(),
                2,
              )}
            </span>{" "}
            U2U
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
        "h-full flex flex-col rounded-xl p-2 gap-2 border border-1 hover:shadow-md border-soft transition-all"
      }
    >
      {renderMedia()}
      <div className="flex gap-1 items-center px-1">
        {/* <VerifyIcon width={16} height={16} /> */}
        <Tooltip content={name} placement="top">
          <Text className="text-secondary text-body-12 whitespace-nowrap overflow-hidden text-ellipsis desktop:max-w-[235px] tablet:w-[150px] w-[100px]">
            {name}
          </Text>
        </Tooltip>
      </div>

      {renderNFTData()}
    </Link>
  );
}
