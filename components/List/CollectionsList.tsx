import { Spinner, Tooltip } from "flowbite-react";
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

interface Props {
  loading?: boolean;
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
  loading,
  error,
  showFilter,
  showCreateCollection,
  creator,
}: Props) {
  const myId = useAuthStore((state) => state.profile?.id);

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
          showFilter ? "desktop:grid-cols-3" : "desktop:grid-cols-4",
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
            return (
              <Link key={c.id} href={`/collection/${link}`}>
                <div className="flex flex-col rounded-xl border border-1 hover:shadow-md border-soft transition-all">
                  <div className="relative">
                    <Image
                      className="cursor-pointer rounded-tl-xl rounded-tr-xl object-cover"
                      src={getCollectionBannerImage(c)}
                      alt="Cover"
                      width={1200}
                      height={256}
                      style={{ width: "100%", height: "100px" }}
                    />
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: "56px",
                        height: "56px",
                        top: "60px",
                        left: "16.3px",
                        border: "2px solid #fff",
                      }}
                    >
                      <Image
                        className="cursor-pointer rounded-full object-cover"
                        src={getCollectionAvatarImage(c)}
                        alt="Avatar"
                        width={60}
                        height={60}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  </div>
                  <div className="pt-6 px-3 pb-4 flex justify-between">
                    <div className="flex gap-2 w-full justify-between">
                      <div className="flex gap-2 flex-col">
                        <div className="flex gap-1 items-center">
                          <Tooltip content={c.name} placement="bottom">
                            <Text className="font-medium text-ellipsis whitespace-nowrap text-gray-900 max-w-[100px] overflow-hidden break-words">
                              {c.name}
                            </Text>
                          </Tooltip>
                          {/* <VerifyIcon width={16} height={16} /> */}
                        </div>
                        <div className="flex gap-2">
                          <Text className="text-body-12 font-medium">
                            {c.totalOwner}
                          </Text>
                          <Text className="text-body-12 text-secondary">
                            Owners
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-col">
                        <Text className="text-body-12 font-medium">Items</Text>
                        <Text className="text-body-12 text-secondary">
                          {c.totalNft}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2 flex-col">
                        <Text className="text-body-12 font-medium">Volume</Text>
                        <Text className="text-body-12 text-secondary">
                          {formatDisplayedNumber(formatUnits(c.volumn || 0))}{" "}
                          U2U
                        </Text>
                      </div>
                      <div className="flex items-center gap-2 flex-col">
                        <Text className="text-body-12 font-medium">Floor</Text>
                        <Text className="text-body-12 text-secondary">
                          {formatDisplayedNumber(c.floorPrice || 0)}{" "}
                          U2U
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <div className="flex justify-center items-center">
        {loading && (
          <div className="w-full h-56 flex justify-center items-center">
            <Spinner size="xl" />
          </div>
        )}
        {!currentHasNext && (
          <div className="w-full h-36 flex justify-center items-center">
            No more data
          </div>
        )}
      </div>
    </>
  );
}
