"use client";

import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CollectionStatisticItem } from "@/types";
import { formatDisplayedNumber } from "@/utils";
import { formatEther } from "viem";
import { getCollectionAvatarImage } from "@/utils/string";
import CollectionsDesktopSkeleton from "./collections-desktop-skeleton";
import { useRouter } from "next/navigation";
import ArrowRightIcon from "../Icon/ArrowRight";
import Text from "../Text";

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
  collections: {
    concatenatedData: CollectionStatisticItem[];
    currentHasNext: boolean;
  };
  isLoading: boolean;
  isLoadingMore: boolean;
}) {
  const router = useRouter();
  const data = useMemo(() => collections.concatenatedData, [collections]);

  const renderHeader = (
    title: string,
    sorting?: {
      field: string;
    }
  ) => {
    const isSorted =
      sorting && currentSorting && currentSorting.field === sorting.field;
    return (
      <div
        onClick={() => {
          if (!sorting) return;
          if (currentSorting && currentSorting.field === sorting.field) {
            const newCurrSorting: { field: string; direction: "asc" | "desc" } =
              {
                ...currentSorting,
                direction: currentSorting.direction === "asc" ? "desc" : "asc",
              };
            setCurrentSorting(newCurrSorting);
          } else {
            setCurrentSorting({
              field: sorting.field,
              direction: "desc",
            });
          }
        }}
        style={{
          cursor: sorting ? "pointer" : "default",
          color: isSorted ? "black" : "#16161A99",
        }}
        className="h-[48px] flex justify-start items-center"
      >
        <div
          className="flex justify-start items-center text-[12px] font-semibold uppercase gap-[2px] pl-[10px] pr-[5px] py-[5px] rounded-md"
          style={{
            background: isSorted ? "#f5f5f5" : "transparent",
          }}
        >
          {title}{" "}
          {sorting &&
            currentSorting &&
            currentSorting.field === sorting.field &&
            (currentSorting.direction === "desc" ? (
              <ArrowRightIcon className="rotate-[90deg]" width={14} />
            ) : (
              <ArrowRightIcon className="-rotate-[90deg]" width={14} />
            ))}
        </div>
      </div>
    );
  };

  const columns = React.useMemo<ColumnDef<CollectionStatisticItem>[]>(
    () => [
      {
        header: () => renderHeader("#"),
        accessorKey: "index",
        // cell: (info) => info.getValue(),
        size: 60,
        cell: (info) => {
          return (
            <span className="text-[#65636F] text-[14px] font-medium">
              {info.row.index + 1}
            </span>
          );
        },
        enableSorting: false,
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorFn: (row) => row.collection.name,
        id: "name",
        cell: (info) => {
          const avatarURL = getCollectionAvatarImage(
            info.row.original.collection
          );
          return (
            <div className="flex items-center justify-start gap-8">
              <img
                style={{
                  width: "48px",
                  height: "48px",
                }}
                src={avatarURL ?? ""}
                className="rounded-md"
                alt={info.row.original.id}
              />
              <span className="font-semibold text-[16px] text-[#252525]">
                {info.row.original.collection.name}
              </span>
            </div>
          );
        },
        header: () => renderHeader("Collection"),
        size: 450,
        enableSorting: false,
      },
      {
        accessorKey: "floorPrice",
        header: () =>
          renderHeader("Floor price", {
            field: "floorPrice",
          }),
        cell: (info) => {
          const value = info.getValue();
          return value && Number(value) > 0 ? (
            <div>
              <span className="text-[#252525] font-semibold text-[16px]">
                {formatDisplayedNumber(value as number)}
              </span>
              <span className="text-[#6A6A6A] font-medium text-[16px]">
                &nbsp;U2U
              </span>
            </div>
          ) : (
            <div>-</div>
          );
        },
        size: 150,
        enableSorting: false,
      },
      {
        accessorKey: "floorPriceChange",
        header: () => renderHeader("Floor change"),
        size: 150,
        enableSorting: false,
        cell: (info) => {
          const value = info.getValue() as number;
          if (!value || value === 0) return <div>-</div>;
          if (value < 0) {
            return <span className="text-[#E31B1B]">{value}%</span>;
          }
          return <span className="text-[#21AE46]">+{value}%</span>;
        },
      },
      {
        accessorKey: "volumeWei",
        header: () =>
          renderHeader("Volume", {
            field: "volume",
          }),
        cell: (info) => {
          const value = info.getValue() as string;
          return `${formatDisplayedNumber(
            formatEther(info.getValue() ? BigInt(value) : BigInt(0))
          )} U2U`;
        },
        size: 150,
        enableSorting: false,
      },
      {
        accessorKey: "volumeChange",
        header: () => renderHeader("Volume change"),
        size: 150,
        cell: (info) => {
          const value = info.getValue() as number;
          if (!value || value === 0) return <div>-</div>;
          if (value < 0) {
            return <span className="text-[#E31B1B]">{value}%</span>;
          }
          return <span className="text-[#21AE46]">+{value}%</span>;
        },
        enableSorting: false,
      },
      {
        accessorKey: "items",
        header: () => renderHeader("Items", { field: "items" }),
        size: 150,
        cell: (info) => formatDisplayedNumber(info.getValue() as number),
        enableSorting: false,
      },
      {
        accessorKey: "owner",
        header: () => renderHeader("Owners", { field: "owner" }),
        size: 150,
        cell: (info) => formatDisplayedNumber(info.getValue() as number),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: data as CollectionStatisticItem[],
    getCoreRowModel: getCoreRowModel(),
  });

  if (!isLoading && table.getRowModel().rows.length === 0) {
    return (
      <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
        <Text className="text-secondary font-semibold text-body-18">
          Nothing to show
        </Text>
      </div>
    );
  }

  if (isLoading) {
    return <CollectionsDesktopSkeleton showHeader />;
  }

  return (
    <div className="pt-2 pb-5 w-full">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => {
                return (
                  <th
                    key={header.id}
                    {...{
                      colSpan: header.colSpan,
                      style: {
                        width: header.getSize(),
                      },
                    }}
                    className="px-[10px]"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="relative">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                onClick={() =>
                  router.push(`/collection/${row.original.collection.id}`)
                }
                key={row.id}
                className="h-[72px] cursor-pointer hover:bg-[rgba(0,0,0,0.05)] transition-colors"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td className="px-[20px]" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {isLoadingMore && <CollectionsDesktopSkeleton showHeader={false} />}
    </div>
  );
}

export default CollectionsDesktop;
