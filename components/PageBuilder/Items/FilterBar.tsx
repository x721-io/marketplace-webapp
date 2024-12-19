"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Input from "@/components/Form/Input";
import SliderIcon from "@/components/Icon/Sliders";
import CommandIcon from "@/components/Icon/Command";
import Icon from "@/components/Icon";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import { useLayerGNFTFilterStore } from "@/store/filters/layerg/byLayerG/store";

export default function FilterBar() {
  const searchParams = useSearchParams();
  const dropdownItems = [
    { name: "All", order: "", orderBy: "all" },
    { name: "Price: Ascending", order: "asc", orderBy: "price" },
    { name: "Price: Descending", order: "desc", orderBy: "price" },
    { name: "Date: Ascending", order: "asc", orderBy: "time" },
    { name: "Date: Descending", order: "desc", orderBy: "time" },
  ];

  const [sortOption, setSortOption] = useState({
    name: "All",
    order: "",
    orderBy: "all",
  });

  const {
    filters: nftFilters,
    showFilters: showNFTFilters,
    toggleFilter: toggleNFTFilters,
    updateFilters: updateNFTFilters,
    resetFilters: resetNFTFilters,
  } = useLayerGNFTFilterStore((state) => state);

  const handleToggleFilters = () => {
    if (!showNFTFilters) {
      toggleNFTFilters(true);
    } else {
      toggleNFTFilters(false);
    }
  };

  const textSearch = useMemo(() => {
    if (nftFilters?.nftName) {
      return nftFilters?.nftName;
    }

    return "";
  }, [nftFilters]);

  const handleInputText = (value: string) => {
    return updateNFTFilters({
      nftName: value || "",
    });
  };

  const handleChange = (selectedOption: any) => {
    let order = "",
      orderBy = "",
      name = "";
    switch (selectedOption) {
      case "Price: Ascending":
        order = "asc";
        orderBy = "price";
        name = "Price: Ascending";
        break;
      case "Price: Descending":
        order = "desc";
        orderBy = "price";
        name = "Price: Descending";
        break;
      case "Date: Ascending":
        order = "asc";
        orderBy = "time";
        name = "Date: Ascending";
        break;
      case "Date: Descending":
        order = "desc";
        orderBy = "time";
        name = "Date: Descending";
        break;
      case "All":
        order = "";
        orderBy = "all";
        name = "All";
        break;
      default:
        order = "";
        orderBy = "all";
        name = "All";
        break;
    }
    setSortOption({ name, order, orderBy });
    if (order !== "") {
      updateNFTFilters({ status: { order: order, orderBy: orderBy } });
    } else {
      resetNFTFilters();
    }
  };

  // useEffect(() => {
  //   if (pathname.includes("collections")) {
  //     // resetNFTFilters();
  //     // resetUserFilters();
  //     // if (!collectionFilters.order) {
  //     //   setSortOption(dropdownItems[0]);
  //     //   return;
  //     // }
  //     // const selectedItem = dropdownItems.find(
  //     //   (item) =>
  //     //     item.order === collectionFilters.order &&
  //     //     item.orderBy === collectionFilters.orderBy
  //     // );
  //     // if (!selectedItem) {
  //     //   setSortOption(dropdownItems[0]);
  //     //   return;
  //     // }
  //     // setSortOption(selectedItem);
  //   } else if (pathname.includes("items")) {
  //     // resetCollectionFilters();
  //     // resetUserFilters();
  //     // if (!nftFilters.order) {
  //     //   setSortOption(dropdownItems[0]);
  //     //   return;
  //     // }
  //     // const selectedItem = dropdownItems.find(
  //     //   (item) =>
  //     //     item.order === nftFilters.order && item.orderBy === nftFilters.orderBy
  //     // );
  //     // if (!selectedItem) {
  //     //   setSortOption(dropdownItems[0]);
  //     //   return;
  //     // }
  //     // setSortOption(selectedItem);
  //   } else if (pathname.includes("users")) {
  //     resetCollectionFilters();
  //     resetUserFilters();
  //     setSortOption(dropdownItems[0]);
  //   }
  // }, [pathname, setSortOption]);

  // useEffect(() => {
  //   if (!pathname.includes("users")) {
  //     customFilters.forEach((ele) => {
  //       if (ele.key !== "sortBy" && ele.key !== "sortDirection") {
  //         updateNFTFilters({
  //           [ele.key]: ele.values[0],
  //         });
  //       }
  //     });
  //     if (
  //         getFilterBykey("sortBy")?.values &&
  //         getFilterBykey("sortDirection")?.values &&
  //         dropdownItems.find(
  //             (ele) =>
  //                 ele.orderBy === getFilterBykey("sortBy")!.values[0] &&
  //                 ele.order === getFilterBykey("sortDirection")!.values[0] &&
  //                 ele.order === getFilterBykey("sortDirection")?.values[0]
  //         )
  //     ) {
  //       const item = dropdownItems.find(
  //           (ele) =>
  //               ele.orderBy === getFilterBykey("sortBy")!.values[0] &&
  //               ele.order === getFilterBykey("sortDirection")!.values[0] &&
  //               ele.order === getFilterBykey("sortDirection")?.values[0]
  //       );
  //       setSortOption(item ?? dropdownItems[0]);
  //       return;
  //     }
  //     setSortOption(dropdownItems[0]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [customFilters, pathname]);

  // useEffect(() => {
  //   if (pathname.includes("collections")) {
  //     sortCollections(sortOption);
  //   } else if (pathname.includes("items")) {
  //     sortNFTs(sortOption);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sortOption, pathname]);

  useEffect(() => {
    if (!searchParams.get("sortBy")) {
      setSortOption(dropdownItems[0]);
    }
  }, [searchParams]);

  return (
    <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap py-4">
      <div className="tablet:order-1">
        <button
          onClick={() => handleToggleFilters()}
          className={
            showNFTFilters
              ? "bg-surface-soft desktop:h-[55px] tablet:h-[55px] h-auto p-4 tablet:px-4 tablet:py-3 laptop:px-6 laptop:py-4 rounded-xl flex items-center gap-2"
              : `tablet:bg-white bg-surface-soft shadow desktop:h-[55px] tablet:h-[55px] h-auto p-4 tablet:px-4 tablet:py-3 laptop:px-6 laptop:py-4 rounded-xl flex items-center gap-2`
          }
        >
          <p className="hidden tablet:block">Filters</p>
          <div className="p-1 tablet:bg-surface-medium rounded-lg">
            <SliderIcon width={16} height={16} />
          </div>
        </button>
      </div>
      <div className="relative flex-1 w-full order-2 desktop:order-3 tablet:min-w-[180px]">
        <Input
          onChange={(e) => handleInputText(e.target.value)}
          value={textSearch}
          type="text"
          className="py-4 h-14 w-full"
          placeholder="Search NFTs"
          appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
          appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5"
        />
      </div>

      <div className="order-4 tablet:flex-1 tablet:max-w-[200px]">
        <Dropdown.Root
          label=""
          icon={
            <div className="bg-surface-soft flex items-center justify-between gap-3 rounded-2xl p-3 h-full cursor-pointer ">
              {sortOption.name}
              <div className="rounded-lg p-1 bg-surface-medium">
                <Icon name="chevronDown" width={14} height={14} />
              </div>
            </div>
          }
        >
          {dropdownItems.map((item: any, i: any) => (
            <Dropdown.Item key={i} onClick={() => handleChange(item.name)}>
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Root>
      </div>
    </div>
  );
}