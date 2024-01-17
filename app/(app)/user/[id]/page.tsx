'use client'

import React, { useState } from "react";
import Profile from "@/components/Pages/UserDetails/Profile";
import { Spinner, Tabs } from 'flowbite-react'
import OwnedNFTs from '@/components/Pages/UserDetails/OwnedNFTs'
import OnSaleNFTs from '@/components/Pages/UserDetails/OnSaleNFTs'
import UserCollections from '@/components/Pages/UserDetails/UserCollections'
import CreatedNFTs from '@/components/Pages/UserDetails/CreatedNFTs'
import Activities from '@/components/Pages/UserDetails/Activities'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import Text from '@/components/Text'
import { formatDisplayedBalance } from '@/utils'

export default function ProfilePage() {
  const api = useMarketplaceApi()
  const { id } = useParams()
  const { data: user, isLoading, error } = useSWR(
    [id],
    (userId) => api.viewProfile(userId.toString()),
    { refreshInterval: 600000 }
  )

  const [ownedAmount, setOwnedAmount] = useState(0)
  const [saleAmount, setSaleAmount] = useState(0)
  const [createdAmount, setCreatedAmount] = useState(0)
  const [createdCollectionAmount, setCreatedCollectionAmount] = useState(0)

  if (isLoading) {
    return (
      <div className="w-full h-96 p-10 flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="w-full h-96 flex flex-col gap-2 justify-center items-center p-7 rounded-2xl">
        <Text variant="heading-xs" className="text-center text-error">
          Error Report:
        </Text>
        <Text variant="heading-xs" className="text-center text-error">
          <br/>
          {error.message}
          <br />
          Please try again later
        </Text>
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
          <Tabs.Item title={`Owned (${formatDisplayedBalance(ownedAmount, 0)})`}>
            <OwnedNFTs wallet={user.publicKey} onUpdateAmount={setOwnedAmount} />
          </Tabs.Item>
          <Tabs.Item title={`On Sale (${formatDisplayedBalance(saleAmount, 0)})`}>
            <OnSaleNFTs wallet={user.publicKey}  onUpdateAmount={setSaleAmount}/>
          </Tabs.Item>
          <Tabs.Item title={`Created (${formatDisplayedBalance(createdAmount, 0)})`}>
            <CreatedNFTs userId={user.id} wallet={user.publicKey} onUpdateAmount={setCreatedAmount}/>
          </Tabs.Item>
          <Tabs.Item title={`Collections (${formatDisplayedBalance(createdCollectionAmount, 0)})`}>
            <UserCollections userId={user.id} onUpdateAmount={setCreatedCollectionAmount} />
          </Tabs.Item>
          <Tabs.Item title={"Activities"}>
            <Activities wallet={user.publicKey} />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
