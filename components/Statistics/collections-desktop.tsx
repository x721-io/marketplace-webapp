"use client";

import React, { Dispatch, SetStateAction } from "react";
import { CollectionStatisticItem } from "@/types";
import { formatDisplayedNumber } from "@/utils";
import { formatEther } from "viem";
import { getCollectionAvatarImage } from "@/utils/string";
import Text from "../Text";
import Image from "next/image";
import MyTable, { MyTableColumn } from "../X721UIKits/Table";
import Link from "next/link";
import BlurImage from "../X721UIKits/BlurImage";

function CollectionsDesktop({
  collections,
  currentSorting,
  setCurrentSorting,
  isLoading,
  isLoadingMore,
}: {
  currentSorting: {
    field: string;
    direction: "asc" | "desc";
  } | null;
  setCurrentSorting: Dispatch<
    SetStateAction<{
      field: string;
      direction: "asc" | "desc";
    } | null>
  >;
  collections: CollectionStatisticItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
}) {
  const columns: MyTableColumn[] = [
    {
      dataKey: "",
      title: "#",
      width: 60,
      render: (_, __, index) => {
        return (
          <span className="text-[#65636F] text-[14px] font-medium">
            {index + 1}
          </span>
        );
      },
    },
    {
      dataKey: "collection.name",
      title: "Name",
      width: 450,
      render: (rowData: CollectionStatisticItem, cellData: any) => {
        const avatarURL = getCollectionAvatarImage(rowData.collection);
        return (
          <div className="flex items-center justify-start gap-8">
            <BlurImage
              width={48}
              height={48}
              loading="lazy"
              src={avatarURL ?? ""}
              className="rounded-md"
              alt={rowData.collection.id}
            />
            <Link
              href={`/collection/${rowData.collection.id}`}
              className="font-semibold cursor-pointer hover:underline text-[16px] text-[#252525]"
            >
              {cellData}
            </Link>
          </div>
        );
      },
    },
    {
      dataKey: "floorPrice",
      title: "Floor price",
      render: (_, cellData: any) => {
        return cellData && Number(cellData) > 0 ? (
          <div>
            <span className="text-[#252525] font-semibold text-[16px]">
              {formatDisplayedNumber(cellData as number)}
            </span>
            <span className="text-[#6A6A6A] font-medium text-[16px]">
              &nbsp;U2U
            </span>
          </div>
        ) : (
          <div>-</div>
        );
      },
      width: 150,
      sorting:
        currentSorting?.field === "floorPrice"
          ? {
              direction: currentSorting.direction,
              sortFn: () =>
                setCurrentSorting({
                  field: "floorPrice",
                  direction:
                    currentSorting.direction === "asc" ? "desc" : "asc",
                }),
            }
          : {
              direction: "unset",
              sortFn: () =>
                setCurrentSorting({ field: "floorPrice", direction: "desc" }),
            },
    },
    {
      dataKey: "floorPriceChange",
      title: "Floor change",
      width: 150,
      render: (_, cellData: any) => {
        const value = Number(cellData);
        if (!value || value === 0) return <div>-</div>;
        if (value < 0) {
          return <span className="text-[#E31B1B]">{value}%</span>;
        }
        return <span className="text-[#21AE46]">+{value}%</span>;
      },
    },
    {
      dataKey: "volumeWei",
      title: "Volume",
      width: 150,
      render: (_, cellData: any) => {
        const value = cellData as string;
        return `${formatDisplayedNumber(
          formatEther(cellData ? BigInt(value) : BigInt(0))
        )} U2U`;
      },
      sorting:
        currentSorting?.field === "volume"
          ? {
              direction: currentSorting.direction,
              sortFn: () =>
                setCurrentSorting({
                  field: "volume",
                  direction:
                    currentSorting.direction === "asc" ? "desc" : "asc",
                }),
            }
          : {
              direction: "unset",
              sortFn: () =>
                setCurrentSorting({ field: "volume", direction: "desc" }),
            },
    },
    {
      dataKey: "volumeChange",
      title: "Volume change",
      width: 150,
      render: (_, cellData: any) => {
        const value = Number(cellData);
        if (!value || value === 0) return <div>-</div>;
        if (value < 0) {
          return <span className="text-[#E31B1B]">{value}%</span>;
        }
        return <span className="text-[#21AE46]">+{value}%</span>;
      },
    },
    {
      dataKey: "items",
      title: "Items",
      width: 150,
      render: (_, cellData: any) => formatDisplayedNumber(cellData as number),
      sorting:
        currentSorting?.field === "items"
          ? {
              direction: currentSorting.direction,
              sortFn: () =>
                setCurrentSorting({
                  field: "items",
                  direction:
                    currentSorting.direction === "asc" ? "desc" : "asc",
                }),
            }
          : {
              direction: "unset",
              sortFn: () =>
                setCurrentSorting({ field: "items", direction: "desc" }),
            },
    },
    {
      dataKey: "owner",
      title: "Owners",
      width: 150,
      render: (_, cellData: any) => formatDisplayedNumber(cellData as number),
      sorting:
        currentSorting?.field === "owner"
          ? {
              direction: currentSorting.direction,
              sortFn: () =>
                setCurrentSorting({
                  field: "owner",
                  direction:
                    currentSorting.direction === "asc" ? "desc" : "asc",
                }),
            }
          : {
              direction: "unset",
              sortFn: () =>
                setCurrentSorting({ field: "owner", direction: "desc" }),
            },
    },
  ];

  if (!isLoading && collections.length === 0) {
    return (
      <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
        <Text className="text-secondary font-semibold text-body-18">
          Nothing to show
        </Text>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 350px)",
      }}
      className="py-2 w-full"
    >
      <MyTable
        columns={columns}
        data={collections}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
      />
    </div>
  );
}

export default CollectionsDesktop;
