import { Pagination, Table } from 'flowbite-react'
import { APIResponse } from '@/services/api/types'
import { formatEther } from 'ethers'
import Link from 'next/link'
import Text from '@/components/Text'
import React, { useEffect, useMemo } from 'react'
import Image from 'next/image'
import defaultImg from '@/assets/images/default-cover-photo.png'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import VerifyIcon from '../Icon/Verify'
import { parseImageUrl } from '@/utils/nft'
import { formatDisplayedBalance } from '@/utils'

interface Paging {
  page?: number
  limit: number
  total?: number
}

interface Props {
  paging?: Paging
  collections?: APIResponse.Collection[]
  onChangePage: (page: number) => void
}

export default function CollectionsList({ collections, paging, onChangePage }: Props) {

  if (!collections || !collections.length) {
    return (
      <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
        <Text className="text-secondary font-semibold text-body-18">Nothing to show</Text>
      </div>
    )
  }

  const totalPage = useMemo(() => {
    if (!paging?.total) return 0
    return Math.ceil(paging.total / paging.limit)
  }, [paging])

  const metadata = useMemo(() => {
    return collections.map((collection) => {
      if (!collection.metadata) return {};
      if (typeof collection.metadata !== 'string') return collection.metadata;
      return JSON.parse(collection.metadata);
    });
  }, [collections]);

  return (
    <>
      <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
        {Array.isArray(collections) && collections.map((c, index) => (
          <Link key={c.id} href={`/collection/${c.shortUrl}`}>
            <div className="flex flex-col rounded-xl" style={{ border: '0.7px solid #E3E3E3' }}>
              <div className="relative">
                <Image
                  className="cursor-pointer rounded-tl-xl rounded-tr-xl object-cover"
                  src={c.coverImage || defaultImg}
                  alt="Cover"
                  width={1200} height={256}
                  style={{ width: '100%', height: '100px' }}
                />
                <div className="absolute rounded-full"
                  style={{ width: '56px', height: '56px', top: '60px', left: '16.3px', border: '2px solid #fff' }}>
                  <Image
                    className="cursor-pointer rounded-full object-fill"
                    src={c.avatar || defaultAvatar}
                    alt="Avatar"
                    width={60} height={60}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
              <div className="pt-6 px-3 pb-4 flex justify-between">
                <div className="flex gap-2 w-full justify-between">
                  <div className="flex gap-2 flex-col">
                    <div className='flex gap-1 items-center'>
                      <Text className="font-medium text-ellipsis whitespace-nowrap text-gray-900 max-w-[100px] overflow-hidden break-words">{c.name}</Text>
                      <VerifyIcon width={16} height={16} />
                    </div>
                    <div className="flex gap-2">
                      <Text className="text-body-12 font-medium">{c.totalOwner}</Text>
                      <Text className="text-body-12 text-secondary">Owners</Text>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-col">
                    <Text className="text-body-12 font-medium">Items</Text>
                    <Text className="text-body-12 text-secondary">{c.totalNft}</Text>
                  </div>
                  <div className="flex gap-2 flex-col">
                    <Text className="text-body-12 font-medium">Volume</Text>
                    <Text className="text-body-12 text-secondary">{formatDisplayedBalance(formatEther(c.volumn || 0), 2)} U2U</Text>
                  </div>
                  <div className="flex gap-2 flex-col">
                    <Text className="text-body-12 font-medium">Floor</Text>
                    <Text className="text-body-12 text-secondary">{formatDisplayedBalance(formatEther(c.floorPrice || 0), 2)} U2U</Text>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-end mt-20">
        <Pagination currentPage={paging?.page ?? 1} totalPages={totalPage} onPageChange={onChangePage} />
      </div>
    </>
  )
}