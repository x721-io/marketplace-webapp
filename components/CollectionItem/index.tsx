"use client";

import { formatDisplayedNumber } from "@/utils";
import React from "react";
import { formatEther, formatUnits } from "ethers";
import Link from "next/link";
import Text from "@/components/Text";
import Image from "next/image";
import Button from "../Button";
import { Collection } from "@/types";
import {
  classNames,
  getCollectionAvatarImage,
  getCollectionBannerImage,
} from "@/utils/string";
import useAuthStore from "@/store/auth/store";
import Icon from "@/components/Icon";
import MySpinner from "../X721UIKits/Spinner";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const CollectionItem = ({
  c,
  link,
}: {
  c: Collection;
  link: string | null;
}) => {
  return (
    <Link key={c.id} href={`/collection/${link}`}>
      <div className="flex flex-col rounded-xl border border-1 hover:shadow-md border-soft transition-all">
        <div className="relative">
          <Image
            className="cursor-pointer rounded-tl-xl rounded-tr-xl object-cover w-full h-24"
            src={getCollectionBannerImage(c)}
            alt="Cover"
            width={1200}
            height={256}
            loading="lazy"
          />
          <div className="absolute rounded-full w-14 h-14 top-16 left-4 border-2 border-white">
            <Image
              className="cursor-pointer rounded-full object-cover w-full h-full"
              src={getCollectionAvatarImage(c)}
              alt="Avatar"
              width={60}
              height={60}
              loading="lazy"
            />
          </div>
        </div>
        <div className="pt-8 px-3 pb-4 flex justify-between">
          <div className="flex gap-2 w-full flex-col">
            <div className="flex gap-1 items-center">
              <a
                data-tooltip-id={c.name ?? ""}
                data-tooltip-content={c.name ?? ""}
              >
                <Text className="font-medium text-ellipsis whitespace-nowrap text-gray-900 max-w-[100px] overflow-hidden break-words">
                  {c.name}
                </Text>
                <Tooltip id={c.name ?? ""} />
              </a>
              {c.creators &&
              c.creators.length > 0 &&
              c.creators[0].user.accountStatus &&
              c.isVerified ? (
                <Icon name="verify-active" width={16} height={16} />
              ) : (
                <Icon name="verify-disable" width={16} height={16} />
              )}
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1 flex-col">
                <Text className="text-body-12 text-secondary">Owners</Text>
                <Text className="text-body-12">{c.totalOwner}</Text>
              </div>
              <div className="flex items-center gap-1 flex-col">
                <Text className="text-body-12 text-secondary">Items</Text>
                <Text className="text-body-12 ">{c.totalNft}</Text>
              </div>
              <div className="flex items-center gap-1 flex-col">
                <Text className="text-body-12 text-secondary">Volume</Text>
                <Text className="text-body-12">
                  {formatDisplayedNumber(formatUnits(c.volumn || 0))} U2U
                </Text>
              </div>
              <div className="flex items-center gap-1 flex-col">
                <Text className="text-body-12 text-secondary">Floor</Text>
                <Text className="text-body-12">
                  {formatDisplayedNumber(c.floorPrice || 0)} U2U
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionItem;
