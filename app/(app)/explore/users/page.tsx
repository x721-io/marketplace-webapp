'use client'

import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { useUIStore } from '@/store/ui/store'
import { useExploreSectionFilters } from '@/hooks/useFilters'
import useSWR from 'swr'
import Text from '@/components/Text'
import Link from 'next/link'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { APIParams } from '@/services/api/types'
import { Pagination, Spinner } from 'flowbite-react'
import { getUserAvatarImage, getUserCoverImage } from '@/utils/string'
import UserFollow from "@/components/Pages/MarketplaceNFT/UserDetails/UserFollow";
import { formatDisplayedNumber } from "@/utils";
import useAuthStore from "@/store/auth/store";
import Icon from "@/components/Icon";
import { useAuth } from "@/hooks/useAuth";


export default function ExploreUsersPage() {
  const api = useMarketplaceApi()
  const { queryString } = useUIStore(state => state)
  const { searchKey } = useExploreSectionFilters()
  const myId = useAuthStore(state => state.profile?.id)
  const { isLoggedIn } = useAuth()



  const [activePagination, setActivePagination] = useState<APIParams.FetchUsers>({
    page: 1,
    limit: 20
  })

  const { data: users, isLoading, error } = useSWR(
      !!queryString[searchKey] ? { ...activePagination, search: queryString[searchKey], page: 1 } : {
        ...activePagination,
        search: queryString[searchKey]
      },
      params => api.fetchUsers(params),
      { refreshInterval: 5000 }
  )

  const totalPage = useMemo(() => {
    if (!users?.paging?.total) return 0
    return Math.ceil(users?.paging.total / users?.paging.limit)
  }, [users?.paging])

  const handleChangePage = (page: number) => {
    setActivePagination({
      ...activePagination,
      page
    })
    window.scrollTo(0, 0)
  }

  if (isLoading) {
    return (
        <div className="w-full h-56 flex justify-center items-center">
          <Spinner size="xl"/>
        </div>
    )
  }

  if (error && !users) {
    return (
        <div
            className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
          <Text variant="heading-xs" className="text-center">
            Network Error!
            <br/>
            Please try again later
          </Text>
        </div>
    )
  }

  if (!users?.data || !users?.data.length) {
    return (
        <div
            className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
          <Text className="text-secondary font-semibold text-body-18">Nothing to show</Text>
        </div>
    )
  }
  return (
      <>
        <div
            className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
          {users?.data?.map((user: any, index: number) => (
              <Link key={user.username} href={`/user/${user.id}`} passHref>
                <div className="flex flex-col rounded-xl border border-1 hover:shadow-md border-soft transition-all">
                  <div className="relative">
                    <Image
                        className="cursor-pointer w-full h-24 rounded-tl-xl rounded-tr-xl object-cover"
                        src={getUserCoverImage(user)}
                        alt="Cover"
                        width={1200} height={256}
                    />
                    <div className="absolute rounded-full w-14 h-14 top-16 left-4 border-2 border-white ">
                      <Image
                          className="cursor-pointer rounded-full object-fill"
                          src={user.avatar || getUserAvatarImage(user)}
                          alt="Avatar"
                          width={60} height={60}
                      />
                    </div>
                  </div>
                  <div className="px-4 pt-5 pb-2 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2 items-center">
                        <Text className="font-medium">{user.username}</Text>
                        {user.accountStatus ? <Icon name='verify-active' width={16} height={16}/> :
                            <Icon name="verify-disable" width={16} height={16}/>}
                      </div>
                      <div className="flex gap-2">
                        <Text className="text-body-12 font-medium">{formatDisplayedNumber(user.followers, 1)}</Text>
                        <Text className="text-body-12 text-secondary">Followers</Text>
                      </div>
                    </div>
                    <Link href={isLoggedIn ? "#" : "/connect"} className="no-underline">
                      {myId !== user.id &&
                          <UserFollow userId={user.id} isFollowed={user.isFollowed}/>
                      }
                    </Link>
                  </div>
                </div>
              </Link>
          ))}
        </div>
        <div className="flex justify-end">
          <Pagination currentPage={users.paging?.page ?? 1} totalPages={totalPage} onPageChange={handleChangePage}/>
        </div>
      </>
  )
}