'use client'

import React, { useMemo } from "react";
import Image from "next/image";
import { APIResponse } from '@/services/api/types'
import VerifyIcon from "@/components/Icon/Verify";
import Text from "@/components/Text";
import { formatEther } from 'ethers'
import Link from 'next/link'
import { ALLOWED_AUDIO_TYPES, ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from '@/config/constants'

export default function NFTCard({ name, id, price, collection, image, animationUrl }: APIResponse.NFT) {
  const displayMedia = image || animationUrl
  const fileExtension = displayMedia.split('.').pop()

  const fileType = useMemo(() => {
    if (!fileExtension) return 'image'

    switch (true) {
      case ALLOWED_AUDIO_TYPES.includes(fileExtension):
        return 'audio'
      case ALLOWED_VIDEO_TYPES.includes(fileExtension):
        return 'video'
      case ALLOWED_IMAGE_TYPES.includes(fileExtension):
        return 'image'
      default:
        return 'image'
    }
  }, [displayMedia, fileExtension])

  const renderMedia = () => {
    switch (fileType) {
      case "audio":
        return (
          <div className="relative w-full h-[220px] rounded-2xl bg-black flex justify-center items-end p-2">
            <Image
              className="cursor-pointer rounded-xl object-cover w-full h-full"
              src={image}
              alt="image"
              width={220} height={220}
            />
            <audio className="absolute bottom-0 w-full h-[25px]" controls>
              <source src={animationUrl} type={`${fileType}/${fileExtension}`} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )
      case "video":
        return (
          <video className="w-full h-[220px] rounded-2xl" controls>
            <source src={displayMedia} type={`${fileType}/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        )
      case "image":
        return (
          <Image
            className="cursor-pointer rounded-xl object-cover w-full h-[220px]"
            src={displayMedia}
            alt="image"
            width={220} height={220}
          />
        )
    }
  }

  return (
    <Link
      key={id}
      href={`/item/${collection.address}/${id}`}
      className="flex flex-col rounded-xl p-2 gap-2"
      style={{ border: '0.7px solid #E3E3E3' }}>
      {renderMedia()}
      <div className="flex gap-1 items-center px-1">
        <VerifyIcon width={16} height={16} />
        <Text className="text-secondary text-body-12 whitespace-nowrap overflow-hidden text-ellipsis">{name}</Text>
      </div>
      <Text className="font-medium px-1 whitespace-nowrap overflow-hidden text-ellipsis">{collection.name}</Text>
      <Text className="text-body-12 px-1 font-normal whitespace-nowrap overflow-hidden text-ellipsis">
        {price ? formatEther(price) : 0} U2U
      </Text>
    </Link>
  )
}
