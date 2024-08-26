"use client";

import React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { makeData, CollectionChartItem } from "./makeData";

//custom sorting logic for one of our enum columns

function CollectionsTable() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const renderHeader = (title: string) => {
    return (
      <div className="h-[48px] flex items-center text-[12px] text-[#16161A99] font-semibold uppercase">
        {title}
      </div>
    );
  };

  const columns = React.useMemo<ColumnDef<CollectionChartItem>[]>(
    () => [
      {
        header: () => renderHeader("#"),
        accessorKey: "index",
        cell: (info) => info.getValue(),
        size: 60,
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => renderHeader("Collection"),
        size: 400,

        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorKey: "floorPrice",
        header: () => renderHeader("Floor price"),
        size: 150,
        //this column will sort in descending order by default since it is a number column
      },
      {
        accessorKey: "floorChange",
        header: () => renderHeader("Floor change"),
        size: 150,
        sortUndefined: "last", //force undefined values to the end
      },
      {
        accessorKey: "volume",
        header: () => renderHeader("Volume"),
        size: 150,
        // sortingFn: sortStatusFn, //use our custom sorting function for this enum column
      },
      {
        accessorKey: "volumeChange",
        header: () => renderHeader("Volume change"),
        size: 150,
        // enableSorting: false, //disable sorting for this column
      },
      {
        accessorKey: "itemsAmt",
        header: () => renderHeader("Items"),
        size: 150,
        invertSorting: true, //invert the sorting order (golf score-like where smaller is better)
      },
      {
        accessorKey: "ownersAmt",
        header: () => renderHeader("Owners"),
        size: 150,
        // sortingFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
      },
    ],
    []
  );

  const [data, setData] = React.useState(() => makeData(1_000));
  const refreshData = () => setData(() => makeData(100_000)); //stress test with 100k rows

  const table = useReactTable({
    columns,
    data,
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
  console.log(table.getState().sorting);

  return (
    <div className="p-2 w-full">
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
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="h-10">
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
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
    </div>
  );
}

export default CollectionsTable;
