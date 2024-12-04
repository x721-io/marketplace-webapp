import { MyTabs } from "@/components/X721UIKits/Tabs";
import { useState } from "react";
import OrgOverview from "@/components/Org/Overview/overview";
import { orgProperties } from "@/app/(app)/[orgSlug]/view";

interface Props {
  isLoadingMetadata?: boolean;
}

export default function Tab({ isLoadingMetadata = false }: Props) {
  const [currTabIndex, setCurrTabIndex] = useState(1);

  const getComponentByCurrTabIndex = () => {
    switch (currTabIndex) {
      case 1:
        return (
          <OrgOverview overviewElements={orgProperties.overviewElements} />
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
      <div className="tablet:px-20 tablet:py-10 tablet:w-full overflow-auto">
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
          <MyTabs.Item tabIndex={3} active={currTabIndex === 3}>
            <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
              On Sale (0)
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
