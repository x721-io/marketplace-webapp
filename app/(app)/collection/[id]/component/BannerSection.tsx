'use client'

import UploadIcon from '@/components/Icon/Upload'
import React, { useMemo, useRef } from 'react';
import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import Image from 'next/image'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import defaultCoverPhoto from '@/assets/images/default-cover-photo.png'
import { parseImageUrl } from '@/utils/nft'


export default function BannerSectionCollection() {
    const { id } = useParams()
    const api = useMarketplaceApi()
    const { data, isLoading: isFetchingCollection } = useSWR(
        !!id ? id : null,
        (id: string) => api.fetchCollectionById(id),
        { refreshInterval: 30000 }
    )
    const coverImageRef = useRef<HTMLInputElement>(null)
    

    return (
        <div className="bg-cover relative w-full">
            <Image
                src={data?.collection.coverImage ? parseImageUrl(data?.collection.coverImage) : defaultCoverPhoto}
                width={1200} height={256}
                alt="user-detail-bg"
                className="object-cover w-full desktop:h-[220px] tablet:h-[220px] h-[160px]" />
            <div className="absolute border-white rounded-2xl desktop:pl-[80px] tablet:pl-[80px] pl-4 bottom-0"
                style={{ bottom: '0', transform: 'translateY(50%)' }}>
                <Image
                    src={data?.collection.avatar ? parseImageUrl(data?.collection.avatar) : defaultAvatar}
                    alt="user-detail-bg"
                    width={120} height={120}
                    className="rounded-2xl w-[80px] h-[80px] tablet:w-[120px] desktop:w-[120px] tablet:h-[120px] desktop:h-[120px]" />
            </div>
            <div className="absolute right-2 top-2">
                <div className="bg-button-secondary py-3 px-4 h-12 w-12 rounded-xl ">
                    <UploadIcon />
                </div>
                {/* <input
                    className="bg-button-secondary px-4 h-12 w-12 rounded-xl opacity-0"
                    type="file"
                    ref={coverImageRef}
                    onChange={(e) => handleUploadCoverImage(e.target.files)}
                /> */}
            </div>
        </div>
    )
}