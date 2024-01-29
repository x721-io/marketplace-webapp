import { Spinner } from "flowbite-react";
import { APIResponse } from "@/services/api/types";
import Text from "@/components/Text";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ALLOWED_VIDEO_TYPES } from "@/config/constants";
import placeholderImage from "@/assets/images/placeholder-image.svg";

interface Props {
  loading?: boolean;
  data?: APIResponse.SearchNFTs;
  onClose?: () => void;
}

export default function SearchNFTTab({ loading, data, onClose }: Props) {
  if (loading)
    return (
      <div className="w-full flex justify-center items-center mt-4">
        <Spinner size="xl" />
      </div>
    );

  if (!data || !data.length) {
    return (
      <div className="w-full flex justify-center items-center p-4 rounded-2xl border border-disabled border-dashed mt-4">
        <Text className="text-secondary font-semibold text-body-18">
          Nothing to show
        </Text>
      </div>
    );
  }

  return (
    <div className="py-4 flex flex-col gap-3">
      {data.map((nft) => {
        const displayMedia = nft.animationUrl || nft.image;
        const fileExtension = displayMedia ? displayMedia.split(".").pop() : "";
        return (
          <Link
            onClick={onClose}
            href={`/item/${nft.collection?.address}/${nft.id}`}
            key={nft.collection?.address + "-" + nft.u2uId}
            className="flex items-center justify-between gap-4 border border-tertiary rounded-2xl px-2 py-1  opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="flex flex-1 items-center gap-2">
              {(() => {
                if (!fileExtension) {
                  return <div className="w-10 h-10" />;
                }
                switch (true) {
                  case ALLOWED_VIDEO_TYPES.includes(fileExtension):
                    return (
                      <video className="w-10 h-10 rounded-2xl" controls>
                        <source
                          src={displayMedia}
                          type={`video/${fileExtension}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                    );
                  default:
                    return (
                      <Image
                        className="w-10 h-10 rounded-xl object-cover"
                        width={40}
                        height={40}
                        src={nft.image || nft.animationUrl || placeholderImage}
                        alt="NFT Image"
                      />
                    );
                }
              })()}

              <div>
                <Text className="font-semibold text-primary" variant="body-12">
                  {nft.name}
                </Text>
                <Text
                  className="font-semibold text-secondary"
                  variant="body-12"
                >
                  {nft?.collection?.name}
                </Text>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
