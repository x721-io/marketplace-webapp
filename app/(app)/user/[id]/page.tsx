'use client'

import React, { useState } from "react";
import BgImage from "@/assets/images/user-detail-bg.png";
import Avatar from "@/assets/images/user-avatar.png";
import Profile from "./components/Profile";
import { Tabs } from 'flowbite-react'
import OwnedNFTs from './components/OwnedNFTs'
import OnSaleNFTs from './components/OnSaleNFTs'
import UserCollections from './components/UserCollections'
import CreatedNFTs from './components/CreatedNFTs'
import Activities from './components/Activities'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import Text from '@/components/Text'

export default function ProfilePage() {
  const api = useMarketplaceApi()
  const { id } = useParams()
  const { data: user } = useSWR(
    [id],
    () => api.viewProfile(id as string),
    { refreshInterval: 600000 }
  )

  if (!user) {
    return (
      <div className="w-full flex justify-center items-center h-96">
        <Text variant="heading-xs">
          User does not exist!
        </Text>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Profile {...user} />

      <div className="desktop:px-20 tablet:px-20 px-4">
        <Tabs.Group style="underline">
          <Tabs.Item title={"Owned"}>
            <OwnedNFTs />
          </Tabs.Item>
          <Tabs.Item title={"On Sale"}>
            <OnSaleNFTs />
          </Tabs.Item>
          <Tabs.Item title={"Collections"}>
            <UserCollections />
          </Tabs.Item>
          <Tabs.Item title={"Created"}>
            <CreatedNFTs />
          </Tabs.Item>
          <Tabs.Item title={"Activities"}>
            <Activities />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
