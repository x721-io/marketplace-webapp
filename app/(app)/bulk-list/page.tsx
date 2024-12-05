"use client";

import Icon from "@/components/Icon";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import { useUserStore } from "@/store/users/store";
import { daysRanges } from "@/types";
import moment from "moment";

const BulkList = () => {
  const { bulkOrders, removeBulkOrdersItem } = useUserStore();

  const columnClassName = "text-left p-3";
  const headerTextClassName =
    "uppercase text-heading-sm !text-[0.925rem] text-[rgba(0,0,0,0.7)] tracking-wide";

  return (
    <div className="w-[70%] mx-auto pt-10 flex flex-col">
      <div className="w-full font-bold text-[2rem]">List for sale</div>
      <div className="w-full font-medium text-[1.1rem]">
        {bulkOrders.length} items
      </div>
      <div className="w-full mt-6">
        <table className="w-full">
          <tr className="w-full border-solid border-t-[1px] border-b-[1px]">
            <th className={columnClassName + " w-[35%] " + headerTextClassName}>
              Item
            </th>
            <th className={columnClassName + " w-[25%] " + headerTextClassName}>
              Price
            </th>
            <th className={columnClassName + " w-[15%] " + headerTextClassName}>
              Expiration
            </th>
            <th className={columnClassName}></th>
          </tr>
          {bulkOrders.map((o, i) => (
            <tr key={o.nft?.id ?? i}>
              <td className={columnClassName}>{o.nft?.name}</td>
              <td className={columnClassName}>
                <input
                  value={o.totalPrice}
                  className="p-2 rounded-md text-center w-[100px]"
                />
              </td>
              <td className={columnClassName}>
                <Dropdown.Root
                  dropdownContainerClassName="w-full"
                  label=""
                  icon={
                    <div className="w-[100%] relative bg-surface-soft flex items-center justify-center gap-3 rounded-2xl py-3 px-5 h-full cursor-pointer">
                      <div className="flex-1 flex justify-between text-[0.95rem]">
                        <div>
                          {o.daysRange.replaceAll("_", " ").toLowerCase()}
                        </div>
                      </div>
                      <div className="rounded-lg p-1">
                        <Icon name="chevronDown" width={14} height={14} />
                      </div>
                    </div>
                  }
                >
                  {daysRanges.map((item) => (
                    <Dropdown.Item
                      key={item}
                      className="w-full rounded-md"
                      onClick={() => {
                        // setValue("daysRange", item);
                        // const newEnd =
                        //   start +
                        //   parseInt(item.split("_")[0]) * 24 * 60 * 60 * 1000;
                        // setValue("end", newEnd);
                      }}
                    >
                      <div className="w-full flex items-center gap-2">
                        {item.replaceAll("_", " ").toLowerCase()}
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Root>
              </td>
              <td className={columnClassName}>
                <button
                  onClick={() => {
                    const itemToDeteleIndex = bulkOrders.findIndex(
                      (ele) =>
                        ele.nft?.id === o.nft?.id &&
                        ele.nft?.collectionId === o.nft?.collectionId
                    );
                    removeBulkOrdersItem(itemToDeteleIndex);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default BulkList;
