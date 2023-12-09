'use client'

import UploadIcon from '@/components/Icon/Upload'
import React, { useMemo, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image'
import { useUpdateCollection } from "@/hooks/useCollection";
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { parseImageUrl } from '@/utils/nft'
import { toast } from 'react-toastify'
import useAuthStore from '@/store/auth/store'
import { APIResponse } from '@/services/api/types'

interface Props {
  cover: string | StaticImageData
  avatar: string | StaticImageData
  creators?: APIResponse.CollectionDetails['collection']['creators']
}

export default function BannerSectionCollection({ cover, avatar, creators }: Props) {
  const coverImageRef = useRef<HTMLInputElement>(null)
  const wallet = useAuthStore(state => state.profile?.publicKey)
  const isOwner = useMemo(() => {
    if (!creators) return false
    return creators.some(creator => creator.address === wallet) ?? false
  }, [creators, wallet])

  const api = useMarketplaceApi()
  const { onUpdateCollection } = useUpdateCollection()

  const handleInputImage = async (files: FileList | null) => {
    if (!files) return
    const toastId = toast.loading('Uploading Cover image...', { type: 'info' })
    try {
      const { fileHashes } = await api.uploadFile(files[0])

      await onUpdateCollection({
        coverImage: fileHashes[0],
        txCreationHash: '',
        name: '',
        symbol: '',
        description: '',
        type: null,
        shortUrl: '',
        creators: ''
      })
      toast.update(toastId, {
        render: 'Cover image updated successfully',
        type: 'success',
        isLoading: false,
        autoClose: 1000
      })
    } catch (e: any) {
      toast.update(toastId, {
        render: `Error report: ${e.message || e}`,
        type: 'error',
        isLoading: false,
        autoClose: 1000
      })
    } finally {
      if (coverImageRef && coverImageRef.current) {
        coverImageRef.current.value = ""
      }
    }
  }
  return (
    <div
      className="bg-cover relative w-full h-[180px]"
      style={{ background: 'var(--gradient-001, linear-gradient(90deg, #22C746 -2.53%, #B0F445 102.48%))' }}>

      <div className="absolute desktop:ml-20 tablet:ml-20 ml-4 block w-[120px] h-[120px] desktop:bottom-[-46px] tablet:bottom-[-46px] bottom-[-75px]">
        <Image
          src={avatar}
          alt="user-detail-bg"
          width={120} height={120}
          className="rounded-2xl w-[80px] h-[80px] tablet:w-[120px] desktop:w-[120px] tablet:h-[120px] desktop:h-[120px]" />
      </div>

      {
        isOwner && (
          <div className="absolute right-2 top-2 bg-button-secondary rounded-xl w-12 h-12">

            <div className="absolute top-[33%] left-[31%]">
              <UploadIcon width={16} height={16} />
            </div>
            <input
              className="bg-button-secondary px-4 h-12 w-12 rounded-xl opacity-0"
              type="file"
              ref={coverImageRef}
              onChange={(e) => handleInputImage(e.target.files)}
            />
          </div>
        )
      }

      {!!cover &&
        <Image
          className="w-full h-[180px] object-cover"
          src={cover}
          alt="Cover"
          width={1200}
          height={256}
        />
      }
    </div>
  )

}