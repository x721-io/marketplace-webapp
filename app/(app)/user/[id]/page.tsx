'use client'

import React from "react";
import BgImage from "@/assets/images/user-detail-bg.png";
import Avatar from "@/assets/images/user-avatar.png";
import Profile from "./components/Profile";
import { Tabs } from 'flowbite-react'
import OwnedNFTs from './components/OwnedNFTs'
import OnSaleNFTs from './components/OnSaleNFTs'
import UserCollections from './components/UserCollections'
import CreatedNFTs from './components/CreatedNFTs'
import Activities from './components/Activities'

export default function ProfilePage() {
  const userProfile = {
    name: "Jack Krauser",
    bio: "Milady Maker is a collection of 10,000 generative pfpNFT's in a neochibi aesthetic inspired by street style tribes.",
    avatarImage: Avatar,
    backgroundImage: BgImage,
    totalFollower: "235K",
    totalFollowing: "22",
    isVerify: true
  };

  return (
    <div>
      <Profile
        name={userProfile.name}
        bio={userProfile.bio}
        avatarImage={userProfile.avatarImage}
        backgroundImage={userProfile.backgroundImage}
        isVerify={userProfile.isVerify}
      />

      <div className="px-20">
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
