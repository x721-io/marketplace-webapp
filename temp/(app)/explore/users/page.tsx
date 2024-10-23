"use client";

import Text from "@/components/Text";
import React, { useEffect, useRef, useState } from "react";
import useAuthStore from "@/store/auth/store";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useUserFilterStore } from "@/store/filters/users/store";
import { useGetUsers } from "@/hooks/useQuery";
import UserItem from "@/components/UserItem";
import UserItemSkeleton from "@/components/UserItem/skeleton";
import CollectionItemSkeleton from "@/components/CollectionItem/skeleton";

export default function ExploreUsersPage() {
  const filtersTimeout = useRef<any>(null);

  const { filters } = useUserFilterStore();
  const [decouncedFilters, setDebouncedFilters] = useState<any>(filters);
  const myId = useAuthStore((state) => state.profile?.id);
  const { data, size, isLoading, setSize, mutate, error } = useGetUsers(
    decouncedFilters,
    !!decouncedFilters
  );

  const { isLoadingMore, list: users } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });

  useEffect(() => {
    if (filtersTimeout.current) {
      clearInterval(filtersTimeout.current);
    }
    filtersTimeout.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 200);
  }, [filters]);

  if (isLoading) {
    return (
      <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
        {Array(20)
          .fill("")
          .map((_, i) => (
            <CollectionItemSkeleton key={i} />
          ))}
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

  if (!decouncedFilters) {
    return (
      <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
        {Array(20)
          .fill("")
          .map((_, i) => (
            <UserItemSkeleton key={i} />
          ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
        {users.concatenatedData?.map((user: any, index: number) => (
          <UserItem user={user} myId={myId} mutate={mutate} key={user.id} />
        ))}
        {isLoadingMore &&
          Array(20)
            .fill("")
            .map((_, i) => <UserItemSkeleton key={i} />)}
      </div>
      <div className="flex justify-center items-center">
        {!users.currentHasNext && (
          <div className="w-full h-36 flex justify-center items-center">
            No more data
          </div>
        )}
      </div>
    </>
  );
}
