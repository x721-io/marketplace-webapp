"use client";

import React, { useEffect } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCollectionFilterStore } from "@/store/filters/collections/store";
import { useGetCollections } from "@/hooks/useQuery";
import { Collection } from "@/types";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { formatDisplayedNumber } from "@/utils";
import { formatEther } from "viem";
import { getCollectionAvatarImage } from "@/utils/string";

//custom sorting logic for one of our enum columns

function CollectionsTable() {
  const { showFilters, toggleFilter, filters, updateFilters, resetFilters } =
    useCollectionFilterStore((state) => state);
  const { data, size, isLoading, setSize, error } = useGetCollections({
    limit: 20,
    page: 0,
  });
  const { isLoadingMore, list: collections } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const renderHeader = (title: string) => {
    return (
      <div className="h-[48px] flex items-center text-[12px] text-[#16161A99] font-semibold uppercase">
        {title}
      </div>
    );
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  const columns = React.useMemo<ColumnDef<Collection>[]>(
    () => [
      {
        header: () => renderHeader("#"),
        accessorKey: "index",
        // cell: (info) => info.getValue(),
        size: 60,
        cell: (info) => {
          return info.row.index + 1;
        },
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => {
          const avatarURL = getCollectionAvatarImage(info.row.original);
          return (
            <div className="flex items-center gap-8">
              <img
                src={avatarURL ?? ""}
                width={40}
                className="rounded-md"
                alt={info.row.original.id}
              />
              {info.row.original.name}
            </div>
          );
        },
        header: () => renderHeader("Collection"),
        size: 450,
        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorKey: "floorPrice",
        header: () => renderHeader("Floor price"),
        cell: (info) => info.getValue(),
        size: 150,
        //this column will sort in descending order by default since it is a number column
      },
      {
        accessorKey: "floorChange",
        header: () => renderHeader("Floor change"),
        size: 150,
        cell: (info) => {
          const value = info.getValue() as number;
          if (value < 0) {
            return <span className="text-[#E31B1B]">{value}%</span>;
          }
          return <span className="text-[#21AE46]">+{value}%</span>;
        },
        sortUndefined: "last", //force undefined values to the end
      },
      {
        accessorKey: "volumn",
        header: () => renderHeader("Volume"),
        cell: (info) => {
          const value = info.getValue() as string;
          return `${formatDisplayedNumber(
            formatEther(info.getValue() ? BigInt(value) : BigInt(0))
          )} U2U`;
        },
        size: 150,
        // sortingFn: sortStatusFn, //use our custom sorting function for this enum column
      },
      {
        accessorKey: "volumeChange",
        header: () => renderHeader("Volume change"),
        size: 150,
        cell: (info) => {
          const value = info.getValue() as number;
          if (value < 0) {
            return <span className="text-[#E31B1B]">{value}%</span>;
          }
          return <span className="text-[#21AE46]">+{value}%</span>;
        },
        // enableSorting: false, //disable sorting for this column
      },
      {
        accessorKey: "totalNft",
        header: () => renderHeader("Items"),
        size: 150,
        invertSorting: true, //invert the sorting order (golf score-like where smaller is better)
      },
      {
        accessorKey: "totalOwner",
        header: () => renderHeader("Owners"),
        size: 150,
        // sortingFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
      },
    ],
    []
  );
  const table = useReactTable({
    columns,
    data: collections.concatenatedData,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    // sortingFns: {
    //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
    // },
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      sorting,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, //Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
  });

  //access sorting state from the table instance
  return (
    <div className="py-2 w-full">
      <div className="h-2" />
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
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
    </div>
  );
}

export default CollectionsTable;
