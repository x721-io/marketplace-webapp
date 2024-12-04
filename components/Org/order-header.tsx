"use client";

import Image from "next/image";
import { OrgProperties } from "./types";
import UploadIcon from "@/components/Icon/Upload";
import React from "react";
import Text from "@/components/Text";
import Icon from "@/components/Icon";
import Link from "next/link";
import { NFT_COLLECTION_VERIFICATION_REQUEST } from "@/config/constants";
import { formatDisplayedNumber } from "@/utils";
import { formatEther } from "ethers";
import UpdateRoyaltiesModal from "@/components/Modal/UpdateRoyaltiesModal";

export default function SectionBanner({
  orgProperties,
  editMode = true,
}: {
  orgProperties: OrgProperties;
  editMode?: boolean;
}) {
  const renderBanner = (banner: string) => {
    const extension = banner.split(".").pop();
    if (extension === "mp4" || extension === "webm") {
      return (
        <div className="w-full h-full">
          {editMode && (
            <button className="absolute top-0 right-0 z-10 m-2 py-2 px-5 text-[white] font-extrabold cursor-pointer">
              Edit banner
            </button>
          )}
          <video
            loop
            muted
            autoPlay
            src={banner}
            width="100%"
            height="100%"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return (
      <Image
        className="w-full h-full object-cover"
        src={banner}
        alt="banner"
        width={1200}
        height={256}
        objectFit="cover"
        objectPosition="center"
      />
    );
  };

  return (
    <>
      <div className="bg-cover relative w-full aspect-[7/2]">
        <div className="absolute desktop:ml-20 tablet:ml-20 ml-4 block w-[80px] h-[80px] tablet:w-[120px] tablet:h-[120px] tablet:bottom-[-55px] bottom-[-38px]">
          <Image
            src={orgProperties.avatar}
            alt="user-detail-bg"
            width={1440}
            height={220}
            className="rounded-2xl h-full object-cover border-2 border-[#E3E3E3]"
          />
        </div>
        {renderBanner(orgProperties.banner)}
      </div>

      <>
        <div className="w-full flex justify-between pt-20 desktop:px-20 tablet:px-20 px-4 mb-6 tablet:gap-12">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-2">
              <Text className="font-semibold text-primary desktop:text-body-32 tablet:text-body-32 text-body-24 w-auto desktop:max-w-[500px] tablet:max-w-[500px] max-w-[300px]">
                LayerG
              </Text>
              <Icon name="verify-active" width={24} height={24} />
              {/*{creator?.accountStatus && data.collection.isVerified ? (*/}
              {/*    <Icon name="verify-active" width={24} height={24} />*/}
              {/*) : (*/}
              {/*    <Link*/}
              {/*        className="text-secondary hover:text-primary flex justify-center items-center gap-1"*/}
              {/*        href={NFT_COLLECTION_VERIFICATION_REQUEST}*/}
              {/*        target="_blank"*/}
              {/*    >*/}
              {/*      <Icon name="verify-disable" width={24} height={24} />*/}
              {/*      <Text className="text-body-16">Get Verified</Text>*/}
              {/*    </Link>*/}
              {/*)}*/}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={"#"}
                className="font-semibold text-secondary text-body-16 hover:underline"
              >
                Created by:{" "}
                <span className="text-primary font-bold">Memetaverse</span>
              </Link>
            </div>
            <Text
              showTooltip
              labelTooltip={orgProperties.description}
              className="text-secondary text-body-16 font-semibold w-auto desktop:max-w-[600px] tablet:max-w-600px] max-w-[300px]"
            >
              {orgProperties.description}
            </Text>
          </div>

          <div className="  w-full flex items-end">
            <div className="flex justify-around flex-wrap w-full bg-surface-soft rounded-2xl">
              <div className="flex flex-1 flex-col items-center py-3 px-6">
                <Text className="text-secondary">Floor</Text>
                <Text
                  className="text-primary font-bold flex items-center gap-1"
                  variant="body-16"
                >
                  {formatDisplayedNumber(10000)}
                  <span className="text-secondary font-normal">U2U</span>
                </Text>
              </div>
              <div className="flex flex-1 flex-col items-center py-3 px-6">
                <Text className="text-secondary">Volume</Text>
                <Text
                  className="text-primary font-bold flex items-center gap-1"
                  variant="body-16"
                >
                  {formatDisplayedNumber(1000000000)}
                  <span className="text-secondary font-normal">U2U</span>
                </Text>
              </div>
              <div className="flex flex-1 flex-col items-center py-3 px-6">
                <Text className="text-secondary">Items</Text>
                <Text className="text-primary font-bold" variant="body-16">
                  1000
                </Text>
              </div>
              <div className="flex flex-1 flex-col items-center py-3 px-6">
                <Text className="text-secondary">Owner</Text>
                <Text className="text-primary font-bold" variant="body-16">
                  1000
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/*<UpdateRoyaltiesModal*/}
        {/*    show={showRoyaltiesModal}*/}
        {/*    onClose={() => setShowRoyaltiesModal(false)}*/}
        {/*    collection={data.collection}*/}
        {/*/>*/}
      </>
    </>
  );
}
