"use client";

import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { useExploreSectionFilters } from "@/hooks/useFilters";
import Text from "@/components/Text";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { APIParams, APIResponse } from "@/services/api/types";
import { Spinner } from "flowbite-react";
import { getUserAvatarImage, getUserCoverImage, getUserLink, } from "@/utils/string";
import UserFollow from "@/components/Pages/MarketplaceNFT/UserDetails/UserFollow";
import { formatDisplayedNumber, sanitizeObject } from "@/utils";
import useAuthStore from "@/store/auth/store";
import Icon from "@/components/Icon";
import useSWRInfinite from "swr/infinite";
import { useUIStore } from "@/store/ui/store";
import UsersData = APIResponse.UsersData;


export default function ExploreUsersPage() {
  const api = useMarketplaceApi();
  const { queryString } = useUIStore((state) => state);
  const { searchKey } = useExploreSectionFilters();
  const myId = useAuthStore((state) => state.profile?.id);

  const [activePagination] =
    useState<APIParams.FetchUsers>({
      page: 1,
      limit: 10,
    });

  const { data , size, isLoading, setSize, mutate,error } = useSWRInfinite(
      (index) => {
        const queryParams = !!queryString[searchKey]
            ? { ...activePagination, name: queryString[searchKey], page: 1 }
            : {
              ...activePagination,
              name: queryString[searchKey],
              page: index + 1,
            };
        return ["fetchUsers", queryParams];
      },
      ([key, params]) =>
          api.fetchUsers(
              sanitizeObject(params) as APIParams.FetchUsers,
          ),
  );

  const users = useMemo(() => {
    let currentHasNext = false;
    let concatenatedData: any[] = [];

    if (data) {
      concatenatedData = data.reduce(
          (prevData: any[], currentPage: UsersData) => [
            ...prevData,
            ...currentPage.data,
          ],
          [],
      );
      const hasNextArray = data.map(
          (currentPage: UsersData) => currentPage.paging,
      );
      currentHasNext = hasNextArray[data.length - 1].hasNext;
    }

    return { concatenatedData, currentHasNext };
  }, [data]);


  const isLoadingMore =
      isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
          document.documentElement;
      if (
          scrollTop + clientHeight === scrollHeight &&
          !isLoadingMore &&
          size &&
          users.currentHasNext
      ) {
        setSize(size + 1).then(r => console.log(r));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoadingMore, size, users.currentHasNext]);

  if (isLoading) {
    return (
      <div className="w-full h-56 flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error && !users) {
    return (
      <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
        <Text variant="heading-xs" className="text-center">
          Network Error!
          <br />
          Please try again later
        </Text>
      </div>
    );
  }

  if (!users.concatenatedData || !users.concatenatedData.length) {
    return (
      <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
        <Text className="text-secondary font-semibold text-body-18">
          Nothing to show
        </Text>
      </div>
    );
  }
  return (
    <>
      <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
        {users.concatenatedData?.map((user: any, index: number) => (
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
                />
                <div className="absolute rounded-full w-14 h-14 top-16 left-4 border-2 border-white ">
                  <Image
                    className="cursor-pointer rounded-full object-fill"
                    src={getUserAvatarImage(user)}
                    alt="Avatar"
                    width={60}
                    height={60}
                  />
                </div>
              </div>
            </Link>

            <div className="px-4 pt-5 pb-2 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <Text className="font-medium">{user.username}</Text>
                  {user.accountStatus ? (
                    <Icon name="verify-active" width={16} height={16} />
                  ) : (
                    <Icon name="verify-disable" width={16} height={16} />
                  )}
                </div>
                <div className="flex gap-2">
                  <Text className="text-body-12 font-medium">
                    {formatDisplayedNumber(user.followers, 1)}
                  </Text>
                  <Text className="text-body-12 text-secondary">Followers</Text>
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
        ))}
      </div>
      <div className="flex justify-center items-center">
        {isLoadingMore && (
            <div className="w-full h-56 flex justify-center items-center">
              <Spinner size="xl" />
            </div>
        )}
        {!users.currentHasNext && (
            <div className="w-full h-36 flex justify-center items-center">
              No more data
            </div>
        )}
      </div>
    </>
  );
}
