import { formatEther, formatUnits } from "ethers";
import Link from "next/link";
import Text from "@/components/Text";
import React from "react";
import Image from "next/image";
import { formatDisplayedNumber } from "@/utils";
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
import CollectionItem from "../CollectionItem";
import CollectionItemSkeleton from "../CollectionItem/skeleton";

interface Props {
  isLoading?: boolean;
  isLoadMore?: boolean | undefined;
  error?: boolean;
  collections?: Collection[];
  showFilter?: boolean;
  showCreateCollection?: boolean;
  creator?: string;
  currentHasNext: boolean;
}

export default function CollectionsList({
  collections,
  currentHasNext,
  isLoading,
  isLoadMore,
  error,
  showFilter,
  showCreateCollection,
  creator,
}: Props) {
  const myId = useAuthStore((state) => state.profile?.id);

  if (isLoading) {
    return (
      <div
        className={classNames(
          "grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3",
          showFilter ? "desktop:grid-cols-3" : "desktop:grid-cols-4"
        )}
      >
        {Array(20)
          .fill("")
          .map((_, i) => (
            <CollectionItemSkeleton key={i} />
          ))}
      </div>
    );
  }

  if (error && !collections) {
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

  if (!collections || !collections.length) {
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
      <div
        className={classNames(
          "grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3",
          showFilter ? "desktop:grid-cols-3" : "desktop:grid-cols-4"
        )}
      >
        {showCreateCollection
          ? creator === myId && (
              <Link href={`/create/collection`}>
                <div className="flex items-center justify-center rounded-xl hover:shadow-md transition-all h-[192px] border">
                  <Button variant="primary">Create a collection</Button>
                </div>
              </Link>
            )
          : ""}
        {Array.isArray(collections) &&
          collections.map((c, index) => {
            let link = c.shortUrl || c.id || c.address || c.name;
            return <CollectionItem c={c} key={c.id} link={link} />;
          })}
        {isLoadMore &&
          Array(20)
            .fill("")
            .map((_, i) => <CollectionItemSkeleton key={i} />)}
      </div>
      <div className="flex justify-center items-center">
        {!currentHasNext && (
          <div className="w-full h-36 flex justify-center items-center">
            No more data
          </div>
        )}
      </div>
    </>
  );
}
