'use client'

import React, { useState } from "react";
import Profile from "./components/Profile";
import { Spinner, Tabs } from 'flowbite-react'
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
  const { data: user, isLoading } = useSWR(
    [id],
    (userId) => api.viewProfile(userId.toString()),
    { refreshInterval: 600000 }
  )

  if (isLoading) {
    return (
      <div className="w-full h-96 p-10 flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full h-96 p-10 flex justify-center items-center">
        <Text className="font-semibold text-body-32">
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
            <OwnedNFTs wallet={user.publicKey} />
          </Tabs.Item>
          <Tabs.Item title={"On Sale"}>
            <OnSaleNFTs wallet={user.publicKey} />
          </Tabs.Item>
          <Tabs.Item title={"Collections"}>
            <UserCollections />
          </Tabs.Item>
          <Tabs.Item title={"Created"}>
            <CreatedNFTs wallet={user.publicKey} />
          </Tabs.Item>
          <Tabs.Item title={"Activities"}>
            <Activities wallet={user.publicKey} />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
