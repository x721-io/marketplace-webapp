"use client";

import Button from "@/components/Button";
import { useEffect, useMemo, useState } from "react";
import Input from "@/components/Form/Input";
import SliderIcon from "@/components/Icon/Sliders";
import CommandIcon from "@/components/Icon/Command";
import { MyTabs } from "@/components/X721UIKits/Tabs";
import { AnalysisModeSort, AnalysisType } from "@/types";
import { APIParams } from "@/services/api/types";
import { isMobile } from "react-device-detect";
import { Dropdown } from "../X721UIKits/Dropdown";
import Icon from "../Icon";

export default function StatisticsHeader({
  showFilters = true,
  filters,
  toggleFilter,
  updateFilters,
}: {
  showFilters?: boolean;
  filters: APIParams.FetchCollectionsStatistics;
  toggleFilter: (bool?: boolean) => void;
  updateFilters: (
    filters: Partial<APIParams.FetchCollectionsStatistics>
  ) => void;
}) {
  const [sortOption, setSortOption] = useState({
    name: "Volume: Ascending",
    order: "desc",
    orderBy: "volume",
  });
  const dropdownItems = [
    { name: "Floor price: Ascending", order: "asc", orderBy: "floorPrice" },
    { name: "Floor price: Descending", order: "desc", orderBy: "floorPrice" },
    { name: "Volume: Ascending", order: "asc", orderBy: "volume" },
    { name: "Volume: Descending", order: "desc", orderBy: "volume" },
    { name: "Items: Ascending", order: "asc", orderBy: "items" },
    { name: "Items: Descending", order: "desc", orderBy: "items" },
    { name: "Owners: Ascending", order: "asc", orderBy: "owner" },
    { name: "Owners: Descending", order: "desc", orderBy: "owner" },
  ];
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

  const handleToggleFilters = () => {
    return toggleFilter();
  };

  const handleInputText = (value: any) => {
    return updateFilters({ search: value });
  };

  const handleChangeTab = (activeTab: number) => {
    setCurrentTabValue(tabs[activeTab].value);
    updateFilters({
      type: tabs[activeTab].value.toString(),
    });
  };

  const isFiltersVisible = useMemo(() => {
    return showFilters;
  }, [showFilters]);

  const handleChange = (
    order: "asc" | "desc",
    orderBy: string,
    name: string
  ) => {
    setSortOption({ name, order, orderBy });
  };

  useEffect(() => {
    if (sortOption) {
      updateFilters({
        ...filters,
        orderBy: sortOption.orderBy,
        order: sortOption.order,
      });
    }
  }, [sortOption]);

  return (
    <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap w-full">
      {showFilters && (
        <div className="order-3 desktop:order-1 max-[768px]:w-full">
          <Button
            onClick={handleToggleFilters}
            className={
              isFiltersVisible
                ? "bg-white shadow desktop:h-[55px] tablet:h-[55px] h-[56px] max-[768px]:w-full"
                : `bg-surface-soft desktop:h-[55px] tablet:h-[55px] h-[56px] max-[768px]:w-full`
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
      {isMobile && showFilters && (
        <div className="order-4 w-full">
          <Dropdown.Root
            label=""
            icon={
              <div className="flex relative items-center justify-between gap-3 rounded-2xl p-3 h-full cursor-pointer !w-full bg-white shadow">
                {sortOption.name}
                <div className="rounded-lg p-1 bg-surface-medium">
                  <Icon name="chevronDown" width={14} height={14} />
                </div>
              </div>
            }
          >
            {dropdownItems.map((item: any, i: any) => (
              <Dropdown.Item
                key={i}
                className="!w-[300px]"
                onClick={() =>
                  handleChange(item.order, item.orderBy, item.name)
                }
              >
                {item.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Root>
        </div>
      )}
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
          placeholder="Search by collection"
          onChange={(e) => handleInputText(e.target.value)}
          value={filters.search}
          className="py-4 h-14"
          appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
          appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5"
        />
      </div>
    </div>
  );
}
