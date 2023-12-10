'use client'

import React from "react";
import Image from "next/image";
import { APIResponse } from '@/services/api/types'
import VerifyIcon from "@/components/Icon/Verify";
import Text from "@/components/Text";
import { parseImageUrl } from "@/utils/nft";
import defaultImg from '@/assets/images/default-cover-photo.png'
import { formatEther } from 'ethers'
import Link from 'next/link'

export default function NFTCard({ name, id, price, collection, imageHash }: APIResponse.NFT) {

  return (
    <Link
      key={id}
      href={`/item/${collection.address}/${id}`}
      className="flex flex-col rounded-xl p-2 gap-2"
      style={{ border: '0.7px solid #E3E3E3' }}>
      <Image
        className="cursor-pointer rounded-xl object-cover w-full h-[220px]"
        src={imageHash ? parseImageUrl(imageHash) : defaultImg}
        alt="image"
        width={220} height={220}
      />
      <div className="flex gap-1 items-center px-1">
        <VerifyIcon width={16} height={16} />
        <Text className="text-secondary text-body-12">{name}</Text>
      </div>
      <Text className="font-medium px-1">{collection.name}</Text>
      <Text className="text-body-12 px-1 font-normal">
        {price ? formatEther(price) : 0} U2U
      </Text>
    </Link>
  )
}
