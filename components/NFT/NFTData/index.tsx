import { APIResponse } from '@/services/api/types'
import { Tabs } from 'flowbite-react'
import OverviewTab from './Overview'
import BidsTab from '@/components/NFT/NFTData/Bids'
import ActivitiesTab from '@/components/NFT/NFTData/Activities'
import PropertiesTab from '@/components/NFT/NFTData/Properties'

interface Props {
  nft: APIResponse.NFT
  metaData?: APIResponse.NFTMetaData
}

export default function NFTData({ nft, metaData }: Props) {
  return (
    <div className="pb-7">
      <Tabs.Group style="underline">
        <Tabs.Item active title="Overview">
          <OverviewTab metaData={metaData}/>
        </Tabs.Item>
        <Tabs.Item title="Properties">
          <PropertiesTab metaData={metaData}/>
        </Tabs.Item>
        <Tabs.Item title="Bids">
          <BidsTab nft={nft} />
        </Tabs.Item>
        <Tabs.Item title="Activities">
          <ActivitiesTab nft={nft} />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  )
}