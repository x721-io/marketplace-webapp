import { APIResponse } from '@/services/api/types'
import { Tabs } from 'flowbite-react'
import OverviewTab from './Overview'
import BidsTab from '@/components/NFT/NFTData/Bids'
import ActivitiesTab from '@/components/NFT/NFTData/Activities'

export default function NFTData(props: APIResponse.NFT) {
  return (
    <div className="pb-7">
      <Tabs.Group aria-label="Tabs with underline" style="underline">
        <Tabs.Item active title="Overview">
          <OverviewTab />
        </Tabs.Item>
        <Tabs.Item title="Bids">
          <BidsTab nft={props} />
        </Tabs.Item>
        <Tabs.Item title="Activities">
          <ActivitiesTab />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  )
}