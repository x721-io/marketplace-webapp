import { Spinner } from 'flowbite-react'
import { APIResponse } from '@/services/api/types'
import Text from '@/components/Text'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getUserAvatarImage } from '@/utils/string'

interface Props {
  loading?: boolean
  data?: APIResponse.SearchUsers
  onClose?: () => void
}

export default function SearchUserTab({ loading, data, onClose }: Props) {
  if (loading) return (
    <div className="w-full h-56 flex justify-center items-center">
      <Spinner size="xl" />
    </div>
  )

  if (!data || !data.length) {
    return (
      <div className="w-full flex justify-center items-center p-4 rounded-2xl border border-disabled border-dashed mt-4">
        <Text className="text-secondary font-semibold text-body-18">Nothing to show</Text>
      </div>
    )
  }

  return (
    <div className="py-4 flex flex-col gap-3">
      {data.map(user => (
        <Link
          onClick={onClose}
          href={`/user/${user.id}`}
          key={user.id}
          className="flex items-center justify-between gap-4 border border-tertiary rounded-2xl px-2 py-1 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex flex-1 items-center gap-2">
            <Image
              className="w-10 h-10 rounded-xl object-cover"
              width={40}
              height={40}
              src={getUserAvatarImage(user)}
              alt="Avatar" />
            <Text className="font-semibold text-primary" variant="body-12">
              {user.username}
            </Text>
          </div>
        </Link>
      ))}
    </div>
  )
}