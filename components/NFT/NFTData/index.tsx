import { APIResponse } from "@/services/api/types";
import OverviewTab from "./Overview";
import BidsTab from "@/components/NFT/NFTData/Bids";
import ActivitiesTab from "@/components/NFT/NFTData/Activities";
import PropertiesTab from "@/components/NFT/NFTData/Properties";
import OwnersTab from "@/components/NFT/NFTData/Owners";
import { NFT, NFTMetadata } from "@/types";
import { MyTabs } from "@/components/X721UIKits/Tabs";
import { useState } from "react";

interface Props {
  nft: NFT;
  metaData?: NFTMetadata;
  marketData?: APIResponse.NFTMarketData;
}

export default function NFTData({ nft, metaData, marketData }: Props) {
  const [currTabIndex, setCurrTabIndex] = useState(
    nft.collection.type === "ERC1155" ? 0 : 1
  );

  const getComponentByCurrTabIndex = () => {
    switch (currTabIndex) {
      case 0:
        return (
          <div className="max-h-[400px] overflow-y-auto">
            <OwnersTab nft={nft} marketData={marketData} />
          </div>
        );
      case 1:
        return <OverviewTab metaData={metaData} nft={nft} />;
      case 2:
        return <PropertiesTab metaData={metaData} />;
      case 3:
        return <BidsTab marketData={marketData} nft={nft} />;
      case 4:
        return <ActivitiesTab nft={nft} />;
    }
  };

  return (
    <div className="pb-7 tablet:w-full overflow-auto">
      <MyTabs.Group style="underline" onActiveTabChange={setCurrTabIndex}>
        {nft.collection.type === "ERC1155" && (
          <MyTabs.Item tabIndex={0} active={currTabIndex === 0}>
            <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
              Owners ({marketData?.owners.length || 0})
            </div>
          </MyTabs.Item>
        )}
        <MyTabs.Item tabIndex={1} active={currTabIndex === 1}>
          <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
            Overview
          </div>
        </MyTabs.Item>
        <MyTabs.Item tabIndex={2} active={currTabIndex === 2}>
          <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
            Properties
          </div>
        </MyTabs.Item>
        <MyTabs.Item tabIndex={3} active={currTabIndex === 3}>
          <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
            Bids ({marketData?.bidInfo.length || 0})
          </div>
        </MyTabs.Item>
        <MyTabs.Item tabIndex={4} active={currTabIndex === 4}>
          <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
            Activities
          </div>
        </MyTabs.Item>
      </MyTabs.Group>
      {getComponentByCurrTabIndex()}
    </div>
  );
}
