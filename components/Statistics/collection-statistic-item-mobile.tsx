"use client";

import React from "react";
import Link from "next/link";
import Text from "@/components/Text";
import Image from "next/image";
import { CollectionStatisticItem as CollectionStatisticItemType } from "@/types";
import { getCollectionAvatarImage } from "@/utils/string";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ArrowRightIcon from "../Icon/ArrowRight";

const CollectionStatisticItemMobile = ({
  c,
  link,
}: {
  c: CollectionStatisticItemType;
  link: string | null;
}) => {
  const renderChangeVal = (valueStr: string) => {
    const value = Number(valueStr);
    if (!value || value === 0) return <div>-</div>;
    if (value < 0) {
      return (
        <span className="text-[#E31B1B]">
          {parseFloat(value.toString()).toFixed(2)}%
        </span>
      );
    }
    return (
      <span className="text-[#21AE46]">
        +{parseFloat(value.toString()).toFixed(2)}%
      </span>
    );
  };

  return (
    <Link key={c.id} href={`/collection/${link}`}>
      <div className="flex flex-col rounded-xl border border-1 hover:shadow-md border-soft transition-all p-2">
        <div className="relative flex flex-row items-center justify-start gap-4">
          <div className="w-[50px] aspect-square relative">
            <Image
              className="rounded-[12px]"
              src={getCollectionAvatarImage(c.collection)}
              alt="Avatar"
              fill
              objectFit="cover"
              objectPosition="center"
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <Text className="font-semibold text-[16px] text-ellipsis whitespace-nowrap text-[#252525] max-w-[100px] overflow-hidden break-words">
              {c.collection.name}
            </Text>
            <Tooltip id={c.collection.name ?? ""} />
          </div>
          <div className="w-[32px] h-[32px] rounded-full bg-surface-soft flex items-center justify-center">
            <ArrowRightIcon
              className="text-[#6A6A6A] rotate-[-45deg]"
              width={20}
            />
          </div>
        </div>
        <div className="pt-8 px-3 pb-4 flex justify-between items-center">
          <div className="w-[50%] flex flex-col items-center justify-center gap-3">
            <div className="w-full flex items-center justify-center text-[#A4A4A4] font-semibold text-[13px]">
              FLOOR PRICE
            </div>
            <div className="w-full bg-surface-soft flex items-center justify-center py-2 rounded-s-[10px] gap-2 border-solid border-[#E3E3E3] border-r-[1px]">
              <span className="text-[16px] text-[#252525] font-semibold">
                {c.floorPrice}
              </span>
              <span className="text-[16px] text-[#6A6A6A] font-medium">
                U2U
              </span>
            </div>
          </div>
          <div className="w-[50%] flex flex-col items-center justify-center gap-3">
            <div className="w-full flex items-center justify-center text-[#A4A4A4] font-semibold text-[13px]">
              FLOOR CHANGE
            </div>
            <div className="w-full bg-surface-soft flex items-center justify-center py-2 rounded-e-[10px] gap-2">
              <span className="text-[16px] text-[#252525] font-semibold">
                {renderChangeVal(c.floorPriceChange)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionStatisticItemMobile;
