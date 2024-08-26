"use client";

import Text from "@/components/Text";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  getUserAvatarImage,
  getUserCoverImage,
  getUserLink,
} from "@/utils/string";
import UserFollow from "@/components/Pages/MarketplaceNFT/UserDetails/UserFollow";
import { formatDisplayedNumber } from "@/utils";
import Icon from "@/components/Icon";
import { KeyedMutator } from "swr";

const UserItem = ({
  user,
  myId,
  mutate,
}: {
  user: any;
  myId?: string;
  mutate: any;
}) => {
  return (
    <div
      className="flex flex-col rounded-xl border border-1 hover:shadow-md border-soft transition-all"
      key={user.id}
    >
      <Link key={user.username} href={getUserLink(user)}>
        <div className="relative">
          <Image
            className="cursor-pointer w-full h-24 rounded-tl-xl rounded-tr-xl object-cover"
            src={getUserCoverImage(user)}
            alt="Cover"
            width={1200}
            height={256}
            loading="lazy"
          />
          <div className="absolute rounded-full w-[60px] h-[60px] top-16 left-4 border-2 border-white">
            <Image
              className="cursor-pointer rounded-full w-full h-14 object-cover"
              src={getUserAvatarImage(user)}
              alt="Avatar"
              width={60}
              height={60}
              loading="lazy"
            />
          </div>
        </div>
      </Link>

      <div className="px-4 pt-9 pb-2 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Text className="font-medium">{user.username}</Text>
            {user.accountStatus ? (
              <Icon name="verified" width={16} height={16} />
            ) : (
              <Icon name="verify-disable" width={16} height={16} />
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex gap-2">
              <Text className="text-body-12 font-medium">
                {formatDisplayedNumber(user.followers)}
              </Text>
              <Text className="text-body-12 text-secondary">Followers</Text>
            </div>
            <div className="flex gap-2">
              <Text className="text-body-12 font-medium">
                {formatDisplayedNumber(user.following)}
              </Text>
              <Text className="text-body-12 text-secondary">Following</Text>
            </div>
          </div>
        </div>
        {myId !== user.id ? (
          <UserFollow
            userId={user.id}
            isFollowed={user.isFollowed}
            onRefresh={mutate}
          />
        ) : (
          <div className="text-body-14 font-medium text-secondary p-2 rounded-lg bg-surface-soft w-[120px] text-center">
            This is me
          </div>
        )}
      </div>
    </div>
  );
};

export default UserItem;
