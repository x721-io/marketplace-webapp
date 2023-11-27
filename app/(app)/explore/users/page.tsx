"use client"

import PlusIcon from "@/components/Icon/Plus";
import VerifyIcon from "@/components/Icon/Verify";
import Text from "@/components/Text";
import defaultCover from '@/assets/images/default-cover-user.png'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import Image from "next/image";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { useEffect, useState } from "react";
import { APIResponse } from "@/services/api/types";
import Link from 'next/link'

export default function ExploreUsersPage() {
  const [users, setUsers] = useState<APIResponse.User[]>([])
  const api = useMarketplaceApi()

  useEffect(() => {
    api.getUsers({ limit: '10' }).then(res => setUsers(res))
  }, [])

  return (
    <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
      {users.map((user: any, index: number) => (
        <Link key={user.username} href={`/user/${user.id}`}>
          <div className="flex flex-col rounded-xl" style={{ border: '0.7px solid #E3E3E3' }}>
            <div className="relative">
              <Image
                className="cursor-pointer rounded-tl-xl rounded-tr-xl object-cover"
                src={defaultCover}
                alt="Cover"
                style={{ width: '100%', height: '100px' }}
              />
              <div className="absolute rounded-full"
                   style={{ width: '56px', height: '56px', top: '60px', left: '16.3px', border: '2px solid #fff' }}>
                <Image
                  className="cursor-pointer rounded-full object-fill"
                  src={defaultAvatar}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
            <div className="pt-6 px-3 pb-4 flex justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Text className="font-medium">{user.username}</Text>
                  <VerifyIcon width={16} height={16} />
                </div>
                <div className="flex gap-3">
                  <div className="flex gap-2">
                    <Text className="text-body-12 font-medium">2k</Text>
                    <Text className="text-body-12 text-secondary">Followers</Text>
                  </div>
                  <div className="flex gap-2">
                    <Text className="text-body-12 font-medium">2k</Text>
                    <Text className="text-body-12 text-secondary">Followers</Text>
                  </div>
                </div>
              </div>
              <div>
                <button className="p-2 rounded-lg">
                  <PlusIcon width={36} height={36} />
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}