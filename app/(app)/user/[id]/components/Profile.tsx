import React from "react";
import Image from "next/image";
import Text from '@/components/Text'
import Icon from '@/components/Icon'
import { APIResponse } from '@/services/api/types'
import useAuthStore from '@/store/auth/store'
import Button from '@/components/Button'
import Link from 'next/link'
import { parseImageUrl } from "@/utils/nft";
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import defaultCoverPhoto from '@/assets/images/default-cover-photo.png'

export default function Profile({ id, username, bio, avatar, coverImage }: APIResponse.Profile) {
  const myId = useAuthStore(state => state.profile?.id)
  return (
    <div className="">
      <div className="w-full relative">
        <Image
          src={coverImage ? parseImageUrl(coverImage) : defaultCoverPhoto}
          width={1200} height={220}
          alt="user-detail-bg"
          className="w-full desktop:h-[220px] tablet:h-[220px] h-[160px]" />

        <div className="absolute border-white rounded-2xl desktop:pl-[80px] tablet:pl-[80px] pl-4"
             style={{ bottom: '0', transform: 'translateY(50%)' }}>
          <Image
            src={avatar ? parseImageUrl(avatar) : defaultAvatar}
            alt="user-detail-bg"
            width={120} height={120}
            className="rounded-2xl w-[80px] h-[80px] tablet:w-[120px] desktop:w-[120px] tablet:h-[120px] desktop:h-[120px]" />
        </div>
      </div>

      <div className="w-full flex justify-between pt-20 desktop:px-20 tablet:px-20 px-4 mb-14">
        <div className="">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Text className="font-semibold desktop:text-body-32 tablet:text-body-32 text-body-24">{username}</Text>
              <Icon name="verified" width={24} height={24} />
            </div>
            <div>
              <Text className="text-secondary text-sm">{bio ? bio : 'Nothing to show'}</Text>
            </div>
            {
              myId === id && (
                <Link href="/profile">
                  <Button variant="secondary" scale="sm">
                    Edit profile
                  </Button>
                </Link>
              )
            }
          </div>
        </div>
        {/* <button className="bg-button-secondary h-10 w-10 rounded-xl flex justify-center items-center ">
          <Icon name="moreVertical" width={20} height={20} />
        </button> */}
      </div>
    </div>
  )
}
