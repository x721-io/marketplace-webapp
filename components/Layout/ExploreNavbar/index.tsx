"use client";

import { TabsRef } from "flowbite-react";
import Button from "@/components/Button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Input from "@/components/Form/Input";
import SliderIcon from "@/components/Icon/Sliders";
import CommandIcon from "@/components/Icon/Command";
import { useCollectionFilterStore } from "@/store/filters/collections/store";
import { useNFTFilterStore } from "@/store/filters/items/store";
import { useUserFilterStore } from "@/store/filters/users/store";
import Icon from "@/components/Icon";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import { MyTabs } from "@/components/X721UIKits/Tabs";
import useQueryFilters from "@/hooks/useQueryFilters";

export default function ExploreSectionNavbar() {
  const {
    addFilterItems,
    removeFilterItems,
    filters: customFilters,
    getFilterBykey,
  } = useQueryFilters();
  const tabs = [
    { label: "NFTs", href: "/explore/items" },
    { label: "Collections", href: "/explore/collections" },
    { label: "Users", href: "/explore/users" },
  ];

  const dropdownItems = [
    { name: "All", order: "", orderBy: "all" },
    { name: "Price: Ascending", order: "asc", orderBy: "price" },
    { name: "Price: Descending", order: "desc", orderBy: "price" },
    { name: "Date: Ascending", order: "asc", orderBy: "time" },
    { name: "Date: Descending", order: "desc", orderBy: "time" },
  ];

  const pathname = usePathname();
  const router = useRouter();
  const tabsRef = useRef<TabsRef>(null);
  const [sortOption, setSortOption] = useState({
    name: "All",
    order: "",
    orderBy: "all",
  });

  const {
    filters: collectionFilters,
    showFilters: showCollectionFilters,
    toggleFilter: toggleCollectionFilters,
    updateFilters: updateCollectionFilters,
    resetFilters: resetCollectionFilters,
  } = useCollectionFilterStore((state) => state);

  const {
    filters: nftFilters,
    showFilters: showNFTFilters,
    toggleFilter: toggleNFTFilters,
    updateFilters: updateNFTFilters,
    resetFilters: resetNFTFilters,
  } = useNFTFilterStore((state) => state);

  const {
    filters: { search: userSearchText },
    showFilters: showUserFilters,
    toggleFilter: toggleUserFilters,
    updateFilters: updateUserFilters,
    resetFilters: resetUserFilters,
  } = useUserFilterStore((state) => state);

  const isFiltersVisible = useMemo(() => {
    switch (true) {
      case pathname.includes("collections"):
        return showCollectionFilters;
      case pathname.includes("items"):
        return showNFTFilters;
      default:
        return false;
    }
  }, [showCollectionFilters, showNFTFilters, pathname]);

  const handleToggleFilters = () => {
    switch (true) {
      case pathname.includes("collections"):
        return toggleCollectionFilters();
      case pathname.includes("items"):
        return toggleNFTFilters();
      default:
        return null;
    }
  };

  const searchText = useMemo(() => {
    switch (true) {
      case pathname.includes("collections"):
        return collectionFilters.name;
      case pathname.includes("users"):
        return userSearchText;
      case pathname.includes("items"):
        return nftFilters.name;
      default:
        return "";
    }
  }, [pathname, collectionFilters.name, nftFilters.name, userSearchText]);

  const placeholder = useMemo(() => {
    switch (true) {
      case pathname.includes("collections"):
        return "Search Collections";
      case pathname.includes("users"):
        return "Search Users";
      case pathname.includes("items"):
        return "Search NFTs";
      default:
        return "";
    }
  }, [pathname]);

  const handleInputText = (value: any) => {
    switch (true) {
      case pathname.includes("collections"):
        return updateCollectionFilters({ name: value });
      case pathname.includes("items"):
        return updateNFTFilters({ name: value });
      case pathname.includes("users"):
        return updateUserFilters({ search: value });
      default:
        return null;
    }
  };

  const handleChangeTab = (activeTab: number) => {
    removeFilterItems(["sortBy", "sortDirection"]);
    return router.push(tabs[activeTab].href);
  };

  const sortCollections = (sortOptionCollection: any) => {
    updateCollectionFilters({
      orderBy: sortOptionCollection?.orderBy,
      order: sortOptionCollection?.order,
    });
  };

  const sortNFTs = (sortOptionNFT: any) => {
    updateNFTFilters({
      orderBy: sortOptionNFT?.orderBy,
      order: sortOptionNFT?.order,
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
      addFilterItems([
        { item: { key: "sortBy", values: [orderBy] }, type: "single" },
        {
          item: { key: "sortDirection", values: [order] },
          type: "single",
        },
      ]);
    } else {
      removeFilterItems(["sortBy", "sortDirection"]);
    }
  };

  useEffect(() => {
    if (pathname.includes("collections")) {
      // resetNFTFilters();
      // resetUserFilters();
      // if (!collectionFilters.order) {
      //   setSortOption(dropdownItems[0]);
      //   return;
      // }
      // const selectedItem = dropdownItems.find(
      //   (item) =>
      //     item.order === collectionFilters.order &&
      //     item.orderBy === collectionFilters.orderBy
      // );
      // if (!selectedItem) {
      //   setSortOption(dropdownItems[0]);
      //   return;
      // }
      // setSortOption(selectedItem);
    } else if (pathname.includes("items")) {
      // resetCollectionFilters();
      // resetUserFilters();
      // if (!nftFilters.order) {
      //   setSortOption(dropdownItems[0]);
      //   return;
      // }
      // const selectedItem = dropdownItems.find(
      //   (item) =>
      //     item.order === nftFilters.order && item.orderBy === nftFilters.orderBy
      // );
      // if (!selectedItem) {
      //   setSortOption(dropdownItems[0]);
      //   return;
      // }
      // setSortOption(selectedItem);
    } else if (pathname.includes("users")) {
      resetCollectionFilters();
      resetUserFilters();
      setSortOption(dropdownItems[0]);
    }
  }, [pathname, setSortOption]);

  useEffect(() => {
    if (!pathname.includes("users")) {
      if (
        getFilterBykey("sortBy")?.values &&
        getFilterBykey("sortDirection")?.values &&
        dropdownItems.find(
          (ele) =>
            ele.orderBy === getFilterBykey("sortBy")!.values[0] &&
            ele.order === getFilterBykey("sortDirection")!.values[0] &&
            ele.order === getFilterBykey("sortDirection")?.values[0]
        )
      ) {
        const item = dropdownItems.find(
          (ele) =>
            ele.orderBy === getFilterBykey("sortBy")!.values[0] &&
            ele.order === getFilterBykey("sortDirection")!.values[0] &&
            ele.order === getFilterBykey("sortDirection")?.values[0]
        );
        setSortOption(item ?? dropdownItems[0]);
        return;
      }
      setSortOption(dropdownItems[0]);
    }
  }, [customFilters, pathname]);

  useEffect(() => {
    if (pathname.includes("collections")) {
      sortCollections(sortOption);
    } else if (pathname.includes("items")) {
      sortNFTs(sortOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption, pathname]);

  useEffect(() => {
    updateNFTFilters({
      name: "",
    });
    updateCollectionFilters({
      name: "",
    });
    updateUserFilters({
      search: "",
    });

    if (tabsRef.current) {
      switch (true) {
        case pathname.includes("items"):
          tabsRef.current.setActiveTab(0);
          break;
        case pathname.includes("collections"):
          tabsRef.current.setActiveTab(1);
          break;
        case pathname.includes("users"):
          tabsRef.current.setActiveTab(2);
          break;
      }
    }
  }, [tabsRef, pathname]);

  return (
    <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap">
      {!pathname.includes("users") && (
        <div className="order-3 desktop:order-1">
          <Button
            onClick={handleToggleFilters}
            className={
              isFiltersVisible
                ? "bg-white shadow desktop:h-[55px] tablet:h-[55px] h-[56px]"
                : `bg-surface-soft desktop:h-[55px] tablet:h-[55px] h-[56px]`
            }
            scale="lg"
            variant="secondary"
          >
            Filters
            <span className="p-1 bg-surface-medium rounded-lg">
              <SliderIcon width={14} height={14} />
            </span>
          </Button>
        </div>
      )}

      <div className="order-1 w-full desktop:order-2 desktop:flex-none desktop:w-auto">
        <MyTabs.Group onActiveTabChange={handleChangeTab}>
          {tabs.map((tab, i) => (
            <MyTabs.Item
              active={pathname.includes(tab.href)}
              tabIndex={i}
              key={tab.href}
            >
              {tab.label}
            </MyTabs.Item>
          ))}
        </MyTabs.Group>
      </div>
      <div className="relative flex-1 order-2 desktop:order-3 tablet:min-w-[180px]">
        <Input
          onChange={(e) => handleInputText(e.target.value)}
          value={searchText}
          className="py-4 h-14"
          placeholder={placeholder}
          appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
          appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5"
        />
      </div>

      {!pathname.includes("users") && (
        <div className="order-4 max-[768px]:flex-1">
          <Dropdown.Root
            label=""
            icon={
              <div className="bg-surface-soft flex items-center justify-between gap-3 rounded-2xl p-3 h-full cursor-pointer w-full">
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
      )}
    </div>
  );
}
