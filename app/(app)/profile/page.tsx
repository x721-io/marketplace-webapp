"use client"

import React from 'react';
import { Tabs } from 'flowbite-react';
import AccountStep from './component/AccountStep';
import ProfileStep from './component/ProfileStep';
import WalletStep from './component/WalletStep';
import NotificationStep from './component/NotificationStep';
import BannerSection from './component/BannerSection';

export default function ProfilePage() {

  return (
    <div className="w-full relative flex flex-col items-center desktop:py-10 tablet:p-10 py-16 px-4">
      <BannerSection />

      <div className="w-full block desktop:mt-[78px] tablet:mt-[78px] mt-[86px] desktop:px-24 px-0">
        <Tabs.Group aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="Profile">
            <ProfileStep />
          </Tabs.Item>
          <Tabs.Item active title="Account">
            <AccountStep />
          </Tabs.Item>
          <Tabs.Item active title="Wallet">
            <WalletStep />
          </Tabs.Item>
          <Tabs.Item active title="Notification">
            <NotificationStep />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  )
}