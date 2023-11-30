'use client'

import React from "react";
import VerifySticker from "@/assets/svg/verify-sticker";
import Image from "next/image";
import "./style.scss";
import { APIResponse } from '@/services/api/types'
import { useRouter } from 'next/navigation'
import Icon from '@/components/Icon'
import VerifyIcon from "@/components/Icon/Verify";
import Text from "@/components/Text";
import { parseImageUrl } from "@/utils/nft";
import defaultImg from '@/assets/images/default-cover-photo.png'

export default function NFTCard({ name, id, creator, collection, imageHash }: APIResponse.NFT) {
  const router = useRouter()

  return (
    <div key={id} onClick={() => router.push(`/item/${id}`)} className="flex flex-col rounded-xl p-2 gap-2" style={{ border: '0.7px solid #E3E3E3' }}>
      <Image
        className="cursor-pointer rounded-xl object-cover w-full h-[220px]"
        src={imageHash ? parseImageUrl(imageHash) : defaultImg}
        alt="image"
        width={1} height={1}
      />
      <div className="flex gap-1 items-center px-1">
        <VerifyIcon width={16} height={16} />
        <Text className="text-secondary text-body-12">{name}</Text>
      </div>
      <Text className='font-medium px-1'>{collection.name}</Text>
      <Text className='text-body-12 px-1 font-normal	'>0 U2U</Text>
    </div>
  )
}
