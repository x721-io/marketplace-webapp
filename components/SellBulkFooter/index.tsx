"use client";

import { useUserStore } from "@/store/users/store";

export default function SellBulkFooter() {
  const { bulkList, clearBulkList } = useUserStore();

  return (
    <div
      style={{
        bottom: bulkList.length > 0 ? "0px" : "-70px",
        transition: "all 0.25s",
        boxShadow: "0px -5px 24px 0px rgba(0,0,0,0.05)",
      }}
      className="fixed left-0 h-[70px] w-[100%] z-[100] bg-[white] border-solid border-t-[1px] border-surface flex items-center justify-between px-20 gap-5"
    >
      <div className="flex items-center gap-10">
        <div className="font-semibold text-[1.1rem]">
          {bulkList.length} {bulkList.length > 1 ? "items" : "item"}
        </div>
        <button
          className="text-blue-500 font-medium text-[1.05rem] hover:brightness-75"
          onClick={clearBulkList}
        >
          Clear
        </button>
      </div>
      <div className="flex-1 h-[100%] flex items-center justify-end">
        <button className="bg-[blue-400">
          List {bulkList.length} {bulkList.length > 1 ? "items" : "item"}
        </button>
      </div>
    </div>
  );
}
