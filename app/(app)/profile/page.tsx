"use client"

import React, { useEffect, useState } from 'react';
import { Tabs } from 'flowbite-react';
import AccountStep from '@/components/Pages/MarketplaceNFT/ProfileSettings/AccountStep';
import ProfileStep from '@/components/Pages/MarketplaceNFT/ProfileSettings/ProfileStep';
import WalletStep from '@/components/Pages/MarketplaceNFT/ProfileSettings/WalletStep';
import NotificationStep from '@/components/Pages/MarketplaceNFT/ProfileSettings/NotificationStep';
import BannerSection from '@/components/Pages/MarketplaceNFT/ProfileSettings/BannerSection';
import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import Button from '@/components/Button';
import VerifyAccountModal from '@/components/Modal/VerifyAccountModal';
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';
import useAuthStore from '@/store/auth/store';

export default function ProfilePage() {
  const api = useMarketplaceApi()
  const profile = useAuthStore(state => state.profile)
  const { isLoggedIn } = useAuth()
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    if (!isLoggedIn) return redirect('/')
  }, [isLoggedIn]);

  const handleGetVerify = async (email: string, username: string, shortLink: string, bio: string, twitterLink: string, avatar: string) => {
    // try {
    //   const valueInput = await api.verifyAccount({ email, username, shortLink, bio, twitterLink, avatar })
    //   if (valueInput )

    // } catch (e: any) {

    // } finally {

    // }


  }

  return (
    <div className="w-full relative flex flex-col items-center desktop:py-10 tablet:p-10 py-16 px-4">
      <BannerSection />

      <div className='flex w-full'>
        <div className="w-2/3 block desktop:mt-[78px] tablet:mt-[78px] mt-[86px] desktop:px-24 px-0">
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

        <div className='w-1/3 mt-[78px]'>
          <div className=' w-[244px] rounded-2xl flex justify-center items-center p-4 gap-2 flex-col text-center mt-10 ml-20'
            style={{ boxShadow: 'rgba(27, 32, 50, 0.12) 0px 10px 40px' }}
          >
            <div>
              <Icon name="verified" width={72} height={72} />
            </div>
            <Text className="font-semibold  text-body-24">Verify your account</Text>
            <Text className="text-secondary text-body-16">Proceed with verification process to get more visibility and gain trust on U2NFT</Text>
            <Button
              onClick={() => handleGetVerify(profile?.email || '', profile?.username || '', profile?.shortLink || '', profile?.bio || '', profile?.twitterLink || '', profile?.avatar || '')}
              variant="secondary" scale="sm"
              className="w-full tablet:w-auto desktop:w-auto">
              Get Verified
            </Button>
          </div>
        </div>
      </div>

      <VerifyAccountModal
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </div>
  )
}