'use client'

import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { useUIStore } from '@/store/ui/store'
import { useExploreSectionFilters } from '@/hooks/useFilters'
import useSWR from 'swr'
import Text from '@/components/Text'
import Link from 'next/link'
import Image from 'next/image'
import { parseImageUrl } from '@/utils/nft'
import defaultImg from '@/assets/images/default-cover-photo.png'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import VerifyIcon from '@/components/Icon/Verify'
import React from 'react'

export default function ExploreUsersPage() {
  const api = useMarketplaceApi()
  const { queryString } = useUIStore(state => state)
  const { searchKey } = useExploreSectionFilters()
  const { data, isLoading } = useSWR(
    { limit: 10, page: 1, search: queryString[searchKey] },
    params => api.fetchUsers(params)
  )

  if (!data || !data.length) {
    return (
      <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
        <Text className="text-secondary font-semibold text-body-18">Nothing to show</Text>
      </div>
    )
  }

  return (
    <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
      {data.map((user: any, index: number) => (
        <Link key={user.username} href={`/user/${user.id}`}>
          <div className="flex flex-col rounded-xl" style={{ border: '0.7px solid #E3E3E3' }}>
            <div className="relative">
              <Image
                className="cursor-pointer rounded-tl-xl rounded-tr-xl object-cover"
                src={user.coverImage ? parseImageUrl(user.coverImage) : defaultImg}
                alt="Cover"
                width={1200} height={256}
                style={{ width: '100%', height: '100px' }}
              />
              <div className="absolute rounded-full"
                   style={{ width: '56px', height: '56px', top: '60px', left: '16.3px', border: '2px solid #fff' }}>
                <Image
                  className="cursor-pointer rounded-full object-fill"
                  src={user.avatar ? parseImageUrl(user.avatar) : defaultAvatar}
                  alt="Avatar"
                  width={60} height={60}
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
                {/*<div className="flex gap-3">*/}
                {/*  <div className="flex gap-2">*/}
                {/*    <Text className="text-body-12 font-medium">2k</Text>*/}
                {/*    <Text className="text-body-12 text-secondary">Followers</Text>*/}
                {/*  </div>*/}
                {/*  <div className="flex gap-2">*/}
                {/*    <Text className="text-body-12 font-medium">2k</Text>*/}
                {/*    <Text className="text-body-12 text-secondary">Followers</Text>*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>

              {/*<button className="p-2 rounded-lg">*/}
              {/*  <PlusIcon width={36} height={36} />*/}
              {/*</button>*/}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}