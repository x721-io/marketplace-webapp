"use client";

import React, { useEffect, useState } from "react";
import AccountStep from "@/components/Pages/MarketplaceNFT/ProfileSettings/AccountStep";
import ProfileStep from "@/components/Pages/MarketplaceNFT/ProfileSettings/ProfileStep";
import WalletStep from "@/components/Pages/MarketplaceNFT/ProfileSettings/WalletStep";
import BannerSection from "@/components/Pages/MarketplaceNFT/ProfileSettings/BannerSection";
import { useAuth } from "@/hooks/useAuth";
import { redirect, useRouter } from "next/navigation";
import { MyTabs } from "@/components/X721UIKits/Tabs";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useAccount } from "wagmi";

export default function ProfilePage() {
  const [currTabIndex, setCurrTabIndex] = useState(0);
  const { isValidSession } = useAuth();
  useEffect(() => {
    if (!isValidSession) return redirect("/");
  }, [isValidSession]);
  const router = useRouter();
  const { address } = useAccount();

  const getComponentByCurrTabIndex = () => {
    switch (currTabIndex) {
      case 0:
        return <ProfileStep />;
      case 1:
        return <AccountStep />;
      case 2:
        return <WalletStep />;
    }
  };

  return (
    <div className="w-full relative gap-3 tablet:gap-8 desktop:gap-8 flex flex-col items-center desktop:py-10 desktop:px-60 tablet:py-10 tablet:px-16 py-4 px-4">
      <div className="tablet:absolute tablet:top-10 tablet:left-[150px] w-full">
        <Button
          onClick={() => router.push(`/user/${address}`)}
          variant="icon"
          className=""
        >
          <Icon name="arrowLeft" width={19} height={19} />
        </Button>
      </div>
      <BannerSection />
      <div className="w-full">
        <MyTabs.Group onActiveTabChange={setCurrTabIndex} style="underline">
          <MyTabs.Item tabIndex={0} active={currTabIndex === 0}>
            <div className="min-w-fit whitespace-nowrap text-[0.95rem]">
              Profile
            </div>
          </MyTabs.Item>
          <MyTabs.Item tabIndex={1} active={currTabIndex === 1}>
            <div className="min-w-fit whitespace-nowrap text-[0.95rem]">
              Account
            </div>
          </MyTabs.Item>
          <MyTabs.Item tabIndex={2} active={currTabIndex === 2}>
            <div className="min-w-fit whitespace-nowrap text-[0.95rem]">
              Wallet
            </div>
          </MyTabs.Item>
        </MyTabs.Group>
        {getComponentByCurrTabIndex()}
      </div>
    </div>
  );
}
