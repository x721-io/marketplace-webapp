"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import Text from "@/components/Text";
import { formatDisplayedNumber } from "@/utils";
import OwnedNFTs from "@/components/Pages/MarketplaceNFT/UserDetails/OwnedNFTs";
import OnSaleNFTs from "@/components/Pages/MarketplaceNFT/UserDetails/OnSaleNFTs";
import CreatedNFTs from "@/components/Pages/MarketplaceNFT/UserDetails/CreatedNFTs";
import UserCollections from "@/components/Pages/MarketplaceNFT/UserDetails/UserCollections";
import Activities from "@/components/Pages/MarketplaceNFT/UserDetails/Activities";
import Profile from "@/components/Pages/MarketplaceNFT/UserDetails/Profile";
import { useFilterByUser } from "@/store/filters/byUser/store";
import { MyTabs } from "@/components/X721UIKits/Tabs";
import MySpinner from "@/components/X721UIKits/Spinner";
import { useGetProfile } from "@/hooks/useQuery";

export default function ProfilePage() {
  const api = useMarketplaceApi();
  const { id } = useParams();

  // const {
  //   data: user,
  //   isLoading,
  //   error,
  //   mutate,
  // } = useSWR([id], (userId) => api.viewProfile(userId.toString()), {
  //   revalidateOnFocus: false,
  // });
  const filterStore = useFilterByUser();

  const [ownedAmount, setOwnedAmount] = useState(0);
  const [saleAmount, setSaleAmount] = useState(0);
  const [createdAmount, setCreatedAmount] = useState(0);
  const [createdCollectionAmount, setCreatedCollectionAmount] = useState(0);
  const [currTabIndex, setCurrTabIndex] = useState(0);
  const { data: user, isLoading, error, mutate } = useGetProfile(id as string);

  useEffect(() => {
    const userAddress = user?.publicKey;
    console.log({ user });
    if (!userAddress) return;
    if (!filterStore[userAddress]) {
      filterStore.createFiltersForUser(user?.publicKey);
      filterStore.updateFilters("created", userAddress, {
        creatorAddress: userAddress,
      });
      filterStore.updateFilters("owned", userAddress, { owner: userAddress });
      filterStore.updateFilters("onSale", userAddress, { owner: userAddress });
    }
  }, [filterStore, user?.publicKey]);

  if (isLoading) {
    return (
      <div className="w-full h-96 p-10 flex justify-center items-center">
        <MySpinner />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="w-full h-96 flex flex-col gap-2 justify-center items-center p-7 rounded-2xl">
        <Text variant="heading-xs" className="text-center text-error">
          Error Report:
        </Text>
        <Text variant="heading-xs" className="text-center text-error">
          <br />
          {error.message}
          <br />
          Please try again later
        </Text>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-96 p-10 flex justify-center items-center">
        <Text className="font-semibold text-body-32">User does not exist!</Text>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 desktop:mt-0">
      <Profile onRefresh={mutate} user={user} />
      <div className="desktop:px-20 tablet:px-20 px-4">
        <MyTabs.Group onActiveTabChange={setCurrTabIndex} style="underline">
          <MyTabs.Item tabIndex={0} active={currTabIndex === 0}>
            <div className="min-w-fit whitespace-nowrap">
              Owned ({formatDisplayedNumber(ownedAmount)})
            </div>
          </MyTabs.Item>
          <MyTabs.Item tabIndex={1} active={currTabIndex === 1}>
            <div className="min-w-fit whitespace-nowrap">
              On Sale ({formatDisplayedNumber(saleAmount)})
            </div>
          </MyTabs.Item>
          <MyTabs.Item tabIndex={2} active={currTabIndex === 2}>
            <div className="min-w-fit whitespace-nowrap">
              Created ({formatDisplayedNumber(createdAmount)})
            </div>
          </MyTabs.Item>
          <MyTabs.Item tabIndex={3} active={currTabIndex === 3}>
            <div className="min-w-fit whitespace-nowrap">
              Collections ({formatDisplayedNumber(createdCollectionAmount)})
            </div>
          </MyTabs.Item>
          <MyTabs.Item tabIndex={4} active={currTabIndex === 4}>
            <div className="min-w-fit whitespace-nowrap">Activities</div>
          </MyTabs.Item>
        </MyTabs.Group>

        <OwnedNFTs
          isShow={currTabIndex === 0}
          wallet={user.publicKey}
          onUpdateAmount={setOwnedAmount}
        />
        <OnSaleNFTs
          isShow={currTabIndex === 1}
          wallet={user.publicKey}
          onUpdateAmount={setSaleAmount}
        />
        <CreatedNFTs
          isShow={currTabIndex === 2}
          userId={user.id}
          wallet={user.publicKey}
          onUpdateAmount={setCreatedAmount}
        />
        <UserCollections
          isShow={currTabIndex === 3}
          userId={user.id}
          wallet={user.publicKey}
          onUpdateAmount={setCreatedCollectionAmount}
        />
      </div>
    </div>
  );
}
