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
import { AnalysisType } from "@/types";

export default function StatisticsHeader() {
  const [currentTabValue, setCurrentTabValue] = useState<AnalysisType>(
    AnalysisType.ONEDAY
  );
  const tabs: {
    label: string;
    value: AnalysisType;
  }[] = [
    { label: "1D", value: AnalysisType.ONEDAY },
    { label: "7D", value: AnalysisType.ONEWEEK },
    { label: "30D", value: AnalysisType.ONEMONTH },
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
    filters: { name: collectionSearchText },
    showFilters: showCollectionFilters,
    toggleFilter: toggleCollectionFilters,
    updateFilters: updateCollectionFilters,
  } = useCollectionFilterStore((state) => state);

  const {
    filters: { name: nftSearchText },
    showFilters: showNFTFilters,
    toggleFilter: toggleNFTFilters,
    updateFilters: updateNFTFilters,
  } = useNFTFilterStore((state) => state);

  const {
    filters: { search: userSearchText },
    showFilters: showUserFilters,
    toggleFilter: toggleUserFilters,
    updateFilters: updateUserFilters,
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
        return collectionSearchText;
      case pathname.includes("users"):
        return userSearchText;
      case pathname.includes("items"):
        return nftSearchText;
      default:
        return "";
    }
  }, [pathname, collectionSearchText, nftSearchText, userSearchText]);

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
    setCurrentTabValue(tabs[activeTab].value);
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
  };

  useEffect(() => {
    if (pathname.includes("collections")) {
      sortCollections(sortOption);
    } else if (pathname.includes("items")) {
      sortNFTs(sortOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption, pathname]);

  useEffect(() => {
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
    <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap w-full">
      <div className="order-1 w-full desktop:order-2 desktop:flex-none desktop:w-auto">
        <MyTabs.Group onActiveTabChange={handleChangeTab}>
          {tabs.map((tab, i) => (
            <MyTabs.Item
              active={currentTabValue === tab.value}
              tabIndex={i}
              key={tab.value}
            >
              {tab.label}
            </MyTabs.Item>
          ))}
        </MyTabs.Group>
      </div>
      <div className="relative flex-1 order-2 desktop:order-3 min-w-[180px]">
        <Input
          onChange={(e) => handleInputText(e.target.value)}
          value={searchText}
          className="py-4 h-14"
          appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
          appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5"
        />
      </div>
    </div>
  );
}
