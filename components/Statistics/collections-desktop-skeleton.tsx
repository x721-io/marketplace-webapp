"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function CollectionsDesktopSkeleton() {
  const renderHeader = (title: string) => {
    return (
      <div className="h-[48px] flex items-center text-[12px] text-[#16161A99] font-semibold uppercase">
        {title}
      </div>
    );
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: () => renderHeader("#"),
        accessorKey: "",
        id: "1",
        size: 60,
        cell: () => {
          return (
            <div className="w-[40px] h-[40px]">
              <SkeletonTheme
                height={"100%"}
                width={"100%"}
                baseColor="rgba(0,0,0,0.05)"
                highlightColor="rgba(0,0,0,0.000001)"
              >
                <Skeleton />
              </SkeletonTheme>
            </div>
          );
        },
      },
      {
        id: "2",
        cell: () => {
          return (
            <div className="w-[95%] h-[40px]">
              <SkeletonTheme
                height={"100%"}
                width={"100%"}
                baseColor="rgba(0,0,0,0.05)"
                highlightColor="rgba(0,0,0,0.000001)"
              >
                <Skeleton />
              </SkeletonTheme>
            </div>
          );
        },
        header: () => renderHeader("Collection"),
        size: 450,
      },
      {
        id: "3",
        accessorKey: "",
        header: () => renderHeader("Floor price"),
        cell: () => {
          return (
            <div className="w-[100px] h-[40px]">
              <SkeletonTheme
                height={"100%"}
                width={"100%"}
                baseColor="rgba(0,0,0,0.05)"
                highlightColor="rgba(0,0,0,0.000001)"
              >
                <Skeleton />
              </SkeletonTheme>
            </div>
          );
        },
        size: 150,
      },
      {
        id: "4",
        accessorKey: "",
        header: () => renderHeader("Floor change"),
        size: 150,
        cell: () => {
          return (
            <div className="w-[100px] h-[40px]">
              <SkeletonTheme
                height={"100%"}
                width={"100%"}
                baseColor="rgba(0,0,0,0.05)"
                highlightColor="rgba(0,0,0,0.000001)"
              >
                <Skeleton />
              </SkeletonTheme>
            </div>
          );
        },
        sortUndefined: "last",
      },
      {
        id: "5",
        accessorKey: "",
        header: () => renderHeader("Volume"),
        cell: () => {
          return (
            <div className="w-[100px] h-[40px]">
              <SkeletonTheme
                height={"100%"}
                width={"100%"}
                baseColor="rgba(0,0,0,0.05)"
                highlightColor="rgba(0,0,0,0.000001)"
              >
                <Skeleton />
              </SkeletonTheme>
            </div>
          );
          ``;
        },
        size: 150,
      },
      {
        id: "6",
        accessorKey: "",
        header: () => renderHeader("Volume change"),
        size: 150,
        cell: () => {
          return (
            <div className="w-[100px] h-[40px]">
              <SkeletonTheme
                height={"100%"}
                width={"100%"}
                baseColor="rgba(0,0,0,0.05)"
                highlightColor="rgba(0,0,0,0.000001)"
              >
                <Skeleton />
              </SkeletonTheme>
            </div>
          );
        },
      },
      {
        id: "7",
        accessorKey: "",
        header: () => renderHeader("Items"),
        size: 150,
        invertSorting: true,
        cell: () => {
          return (
            <div className="w-[100px] h-[40px]">
              <SkeletonTheme
                height={"100%"}
                width={"100%"}
                baseColor="rgba(0,0,0,0.05)"
                highlightColor="rgba(0,0,0,0.000001)"
              >
                <Skeleton />
              </SkeletonTheme>
            </div>
          );
        },
      },
      {
        id: "8",
        accessorKey: "",
        header: () => renderHeader("Owners"),
        size: 150,
        cell: () => {
          return (
            <div className="w-[100px] h-[40px]">
              <SkeletonTheme
                height={"100%"}
                width={"100%"}
                baseColor="rgba(0,0,0,0.05)"
                highlightColor="rgba(0,0,0,0.000001)"
              >
                <Skeleton />
              </SkeletonTheme>
            </div>
          );
        },
      },
    ],
    []
  );
  const table = useReactTable({
    columns,
    data: Array(10)
      .fill("")
      .map((_, i) => {}),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
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
                  className="px-[20px]"
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
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr
              onClick={() => alert(row.original.id)}
              key={row.id}
              className="h-[72px]"
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td className="px-[5px]" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CollectionsDesktopSkeleton;
