"use client";

import ArrowRightIcon from "@/components/Icon/ArrowRight";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { FC, useCallback, useMemo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const placeholderArr = Array(10).fill("");

export type MyTableColumn = {
  title: string;
  dataKey: string;
  width?: number;
  height?: number;
  sorting?: {
    direction: "asc" | "desc" | "unset";
    sortFn: () => void;
  };
  render?: (rowData: any, cellData: any, index: number) => React.ReactNode;
};

type MyTableProps = {
  columns: MyTableColumn[];
  data: any[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
};

const MyTable: FC<MyTableProps> = ({
  columns,
  data,
  isLoading = false,
  isLoadingMore = false,
}) => {
  const defaultColWidth = 150;
  const totalColsWidth = useMemo(
    () =>
      columns.reduce((prev, curr) => prev + (curr.width ?? defaultColWidth), 0),
    [columns]
  );

  const calculateColWidthPercentageByKey = useCallback(
    (key: string) => {
      const col = columns.find((_col) => _col.dataKey === key);
      if (!col) return 0;
      const colWidth = col.width ?? defaultColWidth;
      return Math.floor((colWidth / totalColsWidth) * 100);
    },
    [columns]
  );

  const renderCol = (col: MyTableColumn) => {
    return (
      <div
        onClick={() => {
          if (!col.sorting) return;
          col.sorting.sortFn();
        }}
        style={{
          width: `${calculateColWidthPercentageByKey(col.dataKey)}%`,
          height: col.height ? `${col.height}px` : "auto",
          cursor: col.sorting ? "pointer" : "default",
          color:
            col.sorting?.direction === "asc" ||
            col.sorting?.direction === "desc"
              ? "black"
              : "#16161A99",
        }}
        className="h-[48px] flex justify-start items-center px-[10px]"
      >
        <div
          className="flex justify-start items-center text-[13px] font-semibold uppercase gap-[2px] pl-[10px] pr-[5px] py-[5px] rounded-md"
          style={{
            background:
              col.sorting?.direction === "asc" ||
              col.sorting?.direction === "desc"
                ? "#f5f5f5"
                : "transparent",
          }}
        >
          {col.title}{" "}
          {col.sorting &&
            col.sorting.direction !== "unset" &&
            (col.sorting.direction === "desc" ? (
              <ArrowRightIcon className="rotate-[90deg]" width={14} />
            ) : (
              <ArrowRightIcon className="-rotate-[90deg]" width={14} />
            ))}
          {col.sorting && col.sorting.direction === "unset" && (
            <SwapVertIcon width={14} />
          )}
        </div>
      </div>
    );
  };

  const renderCel = (col: MyTableColumn, rowData: any, index: number) => {
    let cellData = "";

    if (col.dataKey !== "") {
      if (!col.dataKey.includes(".")) {
        cellData = rowData[col.dataKey];
      } else {
        const fieldsArr: any[] = col.dataKey.split(".");
        let currDepth = 0;
        cellData = rowData[fieldsArr[0]];
        while (currDepth < fieldsArr.length - 1) {
          currDepth++;
          cellData = cellData[fieldsArr[currDepth]];
        }
      }
    }

    return (
      <div
        style={{
          width: `${calculateColWidthPercentageByKey(col.dataKey)}%`,
        }}
        className="px-[20px]"
      >
        {col.render ? col.render(rowData, cellData, index) : cellData}
      </div>
    );
  };

  const renderSkeletonCel = (col: MyTableColumn) => {
    return (
      <div
        style={{
          width: `${calculateColWidthPercentageByKey(col.dataKey)}%`,
          height: "60%",
        }}
      >
        <div className="w-[80%] h-[100%]">
          <SkeletonTheme
            height={"100%"}
            width={"100%"}
            baseColor="rgba(0,0,0,0.05)"
            highlightColor="rgba(0,0,0,0.000001)"
          >
            <Skeleton />
          </SkeletonTheme>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center py-2">
        {columns.map((col) => renderCol(col))}
      </div>
      <div className="w-full flex flex-col">
        {isLoading &&
          placeholderArr.map((_, index) => (
            <div
              key={index}
              className="w-full flex items-center h-[72px] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            >
              {columns.map((col) => renderSkeletonCel(col))}
            </div>
          ))}

        {!isLoading &&
          data.map((dataItem, dataIndex) => (
            <div
              key={dataIndex}
              className="w-full flex items-center h-[72px] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            >
              {columns.map((col) => renderCel(col, dataItem, dataIndex))}
            </div>
          ))}

        {isLoadingMore &&
          !isLoading &&
          placeholderArr.map((_, index) => (
            <div
              key={index}
              className="w-full flex items-center h-[72px] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            >
              {columns.map((col) => renderSkeletonCel(col))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyTable;
