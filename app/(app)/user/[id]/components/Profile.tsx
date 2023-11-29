import React from "react";
import Image from "next/image";
import Text from '@/components/Text'
import Icon from '@/components/Icon'
import { APIResponse } from '@/services/api/types'
import useAuthStore from '@/store/auth/store'
import Button from '@/components/Button'
import Link from 'next/link'

export default function Profile({ id, username, bio, avatar, coverImage }: APIResponse.Profile) {
  const myId = useAuthStore(state => state.profile?.id)
  return (
    <div className="">
      <div className="w-full relative">
        <Image src={coverImage || ''} alt="user-detail-bg" className="w-full h-auto" />

        <div className="absolute border-white rounded-2xl pl-[80px]"
             style={{ bottom: '0', transform: 'translateY(50%)' }}>
          <Image src={avatar || ''} alt="user-detail-bg" width={120} height={120} />
        </div>
      </div>

      <div className="w-full flex justify-between pt-20 px-20 mb-14">
        <div className="">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Text className="font-semibold text-body-32">{username}</Text>
              {<Icon name="verified" width={24} height={24} />}
            </div>
            <div>
              <text className="text-secondary text-sm">{bio}</text>
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
        <button className="bg-button-secondary h-10 w-10 rounded-xl flex justify-center items-center ">
          <Icon name="moreVertical" width={20} height={20} />
        </button>
      </div>
    </div>
  )
}
