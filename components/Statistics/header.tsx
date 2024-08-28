"use client";

import Button from "@/components/Button";
import { useMemo, useState } from "react";
import Input from "@/components/Form/Input";
import SliderIcon from "@/components/Icon/Sliders";
import CommandIcon from "@/components/Icon/Command";
import { MyTabs } from "@/components/X721UIKits/Tabs";
import { AnalysisType } from "@/types";
import { APIParams } from "@/services/api/types";

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

  return (
    <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap w-full">
      {showFilters && (
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
          value={filters.search}
          className="py-4 h-14"
          appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
          appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5"
        />
      </div>
    </div>
  );
}
