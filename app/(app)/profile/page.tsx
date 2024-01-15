"use client"

import React, { useEffect } from 'react';
import { Tabs } from 'flowbite-react';
import AccountStep from '@/components/Pages/ProfileSettings/AccountStep';
import ProfileStep from '@/components/Pages/ProfileSettings/ProfileStep';
import WalletStep from '@/components/Pages/ProfileSettings/WalletStep';
import NotificationStep from '@/components/Pages/ProfileSettings/NotificationStep';
import BannerSection from '@/components/Pages/ProfileSettings/BannerSection';
import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) return redirect('/')
  }, [isLoggedIn]);

  return (
    <div className="w-full relative flex flex-col items-center desktop:py-10 tablet:p-10 py-16 px-4">
      <BannerSection />

      <div className="w-full block desktop:mt-[78px] tablet:mt-[78px] mt-[86px] desktop:px-24 px-0">
        <Tabs.Group style="underline">
          <Tabs.Item active title="Profile">
            <ProfileStep />
          </Tabs.Item>
          <Tabs.Item active title="Account">
            <AccountStep />
          </Tabs.Item>
          <Tabs.Item active title="Wallet">
            <WalletStep />
          </Tabs.Item>
          {/* <Tabs.Item active title="Notification">
            <NotificationStep />
          </Tabs.Item> */}
        </Tabs.Group>
      </div>
    </div>
  )
}