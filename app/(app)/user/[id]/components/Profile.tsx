import React from "react";
import Image from "next/image";
import Text from '@/components/Text'
import Icon from '@/components/Icon'

interface Props {
  name: string
  bio: string
  backgroundImage?: any
  avatarImage?: any
  isVerify: boolean
}

export default function Profile({ name, bio, avatarImage, backgroundImage, isVerify }: Props) {

  return (
    <div className="">
      <div className="w-full relative">
        <Image src={backgroundImage} alt="user-detail-bg" className="w-full h-auto" />

        <div className="absolute border-white rounded-2xl pl-[80px]"
             style={{ bottom: '0', transform: 'translateY(50%)' }}>
          <Image src={avatarImage} alt="user-detail-bg" width={120} height={120} />
        </div>
      </div>

      <div className="w-full flex justify-between pt-20 px-20 mb-14">
        <div className="">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Text className="font-semibold text-body-32">{name}</Text>
              {isVerify && <Icon name="verified" width={24} height={24} />}
            </div>
            <div>
              <text className="text-secondary text-sm">{bio}</text>
            </div>
            <button className="bg-surface-soft w-[100px] h-[44px] rounded-xl">
              <span className="text-sm"> Edit profile</span>
            </button>
          </div>
        </div>
        <button className="bg-button-secondary h-10 w-10 rounded-xl flex justify-center items-center ">
          <Icon name="moreVertical" width={20} height={20} />
        </button>
      </div>
    </div>
  )
}
