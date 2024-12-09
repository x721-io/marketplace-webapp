import { MyTabs } from "@/components/X721UIKits/Tabs";
import { useState } from "react";
import { orgProperties } from "@/app/(app)/[orgSlug]/view";
import OverviewTab from "@/components/PageBuilder/Overview";

interface Props {
  isLoadingMetadata?: boolean;
}

export default function TabRoot({ isLoadingMetadata = false }: Props) {
  const [currTabIndex, setCurrTabIndex] = useState(1);

  const getComponentByCurrTabIndex = () => {
    switch (currTabIndex) {
      case 1:
        return (
          <OverviewTab overviewElements={orgProperties.overviewElements} />
        );
      case 2:
        return (
          <div className="max-h-[500px] overflow-y-auto tablet:pr-[20px]">
            AAAA
          </div>
        );
      case 3:
        return (
          <div className="max-h-[500px] overflow-y-auto tablet:pr-[20px]">
            AAAA
          </div>
        );
      case 4:
        return (
          <div className="max-h-[500px] overflow-y-auto tablet:pr-[20px]">
            AAAA
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 tablet:px-10 laptop:px-20 laptop:py-10 tablet:py-6 tablet:w-full overflow-auto">
        <MyTabs.Group style="underline" onActiveTabChange={setCurrTabIndex}>
          <MyTabs.Item tabIndex={1} active={currTabIndex === 1}>
            <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
              Overview
            </div>
          </MyTabs.Item>
          <MyTabs.Item tabIndex={2} active={currTabIndex === 2}>
            <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
              List Item
            </div>
          </MyTabs.Item>
          <MyTabs.Item tabIndex={4} active={currTabIndex === 4}>
            <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
              Analytics
            </div>
          </MyTabs.Item>
        </MyTabs.Group>
      </div>
      {getComponentByCurrTabIndex()}
    </div>
  );
}
