import Image from "next/image";
import React, { useMemo } from "react";
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
} from "@/config/constants";
import { NFT } from "@/types";
import { convertImageUrl } from "@/utils/nft";

export default function NFTImage({ item }: { item: NFT }) {
  const displayMedia = useMemo(
    () => convertImageUrl(item?.animationUrl || item?.image),
    [item?.animationUrl, item?.image],
  );
  const fileExtension = useMemo(
    () => displayMedia?.split(".").pop(),
    [displayMedia],
  );

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
    if (!displayMedia) return null;
    switch (fileType) {
      case "audio":
        return (
          <div className="relative desktop:h-[512px] tablet:h-auto w-full h-[280px] p-2 rounded-2xl mb-10">
            <Image
              src={item?.image || ""}
              alt=""
              width={512}
              height={512}
              className="object-cover w-full h-full rounded-2xl"
            />
            <audio className="w-[95%] absolute bottom-1 h-[25px]" controls>
              <source
                src={displayMedia}
                type={`${fileType}/${fileExtension}`}
              />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      case "video":
        return (
          <video
            className="desktop:w-[512px] desktop:h-[512px] tablet:h-auto w-full h-[280px] rounded-2xl mb-10"
            controls
          >
            <source src={displayMedia} type={`${fileType}/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        );
      case "image":
        return (
          <Image
            src={displayMedia}
            alt=""
            width={512}
            height={512}
            className="object-cover desktop:w-[512px] desktop:h-[512px] tablet:h-auto w-full h-[280px] rounded-2xl mb-10"
          />
        );
    }
  };

  return renderMedia();
}
