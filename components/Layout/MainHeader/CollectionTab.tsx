import { Spinner } from 'flowbite-react'
import { APIResponse } from '@/services/api/types'
import Text from '@/components/Text'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  loading?: boolean
  data?: APIResponse.SearchCollections
  onClose?: () => void
}

export default function SearchCollectionTab({ loading, data, onClose }: Props) {
  if (loading) return (
    <div className="w-full flex justify-center items-center mt-4">
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
      {data.slice(0, 100).map(collection => {
          return (
            <Link
              onClick={onClose}
              href={`/collection/${collection.id}`}
              key={collection.id}
              className="flex items-center justify-between gap-4 border border-tertiary rounded-2xl px-2 py-1 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex flex-1 items-center gap-2">
                <Image
                  className="w-10 h-10 rounded-xl object-cover"
                  width={40}
                  height={40}
                  src={collection.avatar || ''}
                  alt="Image" />
                <div>
                  <Text className="font-semibold text-primary mb-1" variant="body-12">
                    {collection.name}
                  </Text>
                  <Text className="font-semibold text-secondary mb-1" variant="body-12">
                    {collection.symbol}
                  </Text>
                </div>

              </div>
            </Link>
          )
        }
      )}
    </div>
  )
}