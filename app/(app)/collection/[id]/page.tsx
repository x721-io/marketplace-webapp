'use client'

import UploadIcon from '@/components/Icon/Upload'
import React, { useRef, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import useSWR from 'swr'
import { useNFTFilters } from '@/hooks/useFilters'
import { sanitizeObject } from '@/utils'
import { APIParams } from '@/services/api/types'
import NFTsList from '@/components/List/NFTsList'
import SliderIcon from '@/components/Icon/Sliders'
import Button from '@/components/Button'
import { Dropdown, ListGroup } from 'flowbite-react'
import Icon from '@/components/Icon'
import CommandIcon from '@/components/Icon/Command'
import Input from '@/components/Form/Input'
import Image from 'next/image'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import defaultCoverPhoto from '@/assets/images/default-cover-photo.png'
import Text from '@/components/Text'
import { parseImageUrl } from '@/utils/nft'
import { formatEther } from 'ethers'
import SectionCover from '../../profile/component/SectionCover'

export default function CollectionPage() {
  const { id } = useParams()
  const api = useMarketplaceApi()
  const [showFilters, setShowFilters] = useState(false)
  const { activeFilters, handleApplyFilters, handleChangePage } = useNFTFilters()

  const { data, isLoading: isFetchingCollection } = useSWR(
    !!id ? id : null,
    (id: string) => api.fetchCollectionById(id),
    { refreshInterval: 30000 }
  )

  const { data: items, isLoading: isFetchingItems } = useSWR(
    data?.collection.address ? [data?.collection.address, activeFilters] : null,
    ([address, filters]) => api.fetchNFTs(sanitizeObject({
      ...filters,
      collectionAddress: address
    }) as APIParams.SearchNFT),
    { refreshInterval: 30000 }
  )

  const [imageAvt, setImageAvt] = useState<Blob | undefined>()
  const [imageCover, setImageCover] = useState<Blob | undefined>()
  const [file, setFile] = useState<Blob | undefined>()
  const [fileCover, setFileCover] = useState<Blob | undefined>()
  const inputRef = useRef<HTMLInputElement>(null)
  const inputRefCover = useRef<HTMLInputElement>(null)

  const previewImage = useMemo(() => {
    if (imageAvt) {
      if (typeof imageAvt === "string") return imageAvt;
      return URL.createObjectURL(imageAvt)
    }

    if (!file) return ""
    return URL.createObjectURL(file)
  }, [file, imageAvt])

  const previewImageCover = useMemo(() => {
    if (imageCover) {
      if (typeof imageCover === "string") return imageCover;
      return URL.createObjectURL(imageCover)
    }

    if (!fileCover) return ""
    return URL.createObjectURL(fileCover)
  }, [fileCover, imageCover])

  const handleInputImage = (files: FileList | null) => {
    if (files) {
      setImageAvt(files[0])
      setFile(files[0])
    } else {
      setImageAvt(undefined)
      setFile(undefined)
    }
  }

  const handleInputImageCover = (files: FileList | null) => {
    if (files) {
      setImageCover(files[0])
      setFileCover(files[0])
    } else {
      setImageCover(undefined)
      setFileCover(undefined)
    }
  }

  const handleClearImage = () => {
    setImageAvt(undefined)
    setFile(undefined)
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const handleClearImageCover = () => {
    setImageCover(undefined)
    setFileCover(undefined)
    if (inputRefCover && inputRefCover.current) {
      inputRefCover.current.value = ""
    }
  }


  return (
    <div className="w-full relative">
      {/* Image avatar and cover */}
      <div className="bg-cover relative w-full">
        <Image
          src={data?.collection.metadata ? parseImageUrl(data?.collection.metadata?.image) : defaultCoverPhoto}
          width={1200} height={256}
          alt="user-detail-bg"
          className="object-cover w-full desktop:h-[220px] tablet:h-[220px] h-[160px]" />
        <div className="absolute border-white rounded-2xl desktop:pl-[80px] tablet:pl-[80px] pl-4 bottom-0"
             style={{ bottom: '0', transform: 'translateY(50%)' }}>
          <Image
            src={data?.collection.coverImage ? parseImageUrl(data?.collection.coverImage) : defaultAvatar}
            alt="user-detail-bg"
            width={120} height={120}
            className="rounded-2xl w-[80px] h-[80px] tablet:w-[120px] desktop:w-[120px] tablet:h-[120px] desktop:h-[120px]" />
        </div>
        <div className="absolute right-2 top-2">
          <button className="bg-button-secondary py-3 px-4 h-12 w-12 rounded-xl ">
            <UploadIcon />
          </button>
        </div>
      </div>

      {/* <SectionCover
        file={file}
        fileCover={fileCover}
        inputRef={inputRef}
        inputRefCover={inputRefCover}
        onHandleInputImage={handleInputImage}
        onPreviewImage={data?.collection.coverImage ? parseImageUrl(data?.collection.coverImage) : defaultAvatar}
        onHandleClearImage={handleClearImage}
        onHandleClearImageCover={handleClearImageCover}
        onHandleInputImageCover={handleInputImageCover}
        onPreviewImageCover={data?.collection.coverImage ? parseImageUrl(data?.collection.coverImage) : defaultAvatar}
      /> */}

      {/* Info collection */}
      <div className="w-full flex justify-between pt-20 desktop:px-20 tablet:px-20 px-4 mb-14">
        <div className="">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 justify-between">
              <Text className="font-semibold desktop:text-body-32 tablet:text-body-32 text-body-24">
                {data?.collection.name}
              </Text>
              <Icon name="verified" width={24} height={24} />
            </div>
            <div>
              <Text className="text-secondary text-sm">
                {data?.collection.description}
              </Text>
            </div>
          </div>
        </div>

        <ListGroup className="w-56 p-3">
          <ListGroup.Item>
            <div className="w-full flex items-center justify-between">
              <Text className="text-secondary font-semibold" variant="body-16">
                Floor price:
              </Text>
              <Text className="text-primary font-bold" variant="body-16">
                {formatEther(data?.collection.floorPrice || 0).toString()} U2U
              </Text>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="w-full flex items-center justify-between">
              <Text className="text-secondary font-semibold" variant="body-16">
                Volume:
              </Text>
              <Text className="text-primary font-bold" variant="body-16">
                {formatEther(data?.collection.volumn || 0).toString()} U2U
              </Text>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="w-full flex items-center justify-between">
              <Text className="text-secondary font-semibold" variant="body-16">
                Items:
              </Text>
              <Text className="text-primary font-bold" variant="body-16">
                {data?.collection.totalNft}
              </Text>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="w-full flex items-center justify-between">
              <Text className="text-secondary font-semibold" variant="body-16">
                Owner:
              </Text>
              <Text className="text-primary font-bold" variant="body-16">
                {data?.collection.totalOwner}
              </Text>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </div>

      <div className="mt-10 desktop:px-20 tablet:px-20 px-4">
        <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap mb-4 tablet:mb-8 desktop:mb-8">
          <div className="order-3 desktop:order-1">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-white shadow' : `bg-surface-soft`}
              scale="lg"
              variant="secondary">
              Filters
              <span className="p-1 bg-surface-medium rounded-lg">
                <SliderIcon width={14} height={14} />
              </span>
            </Button>
          </div>

          <div className="relative flex-1 order-2 desktop:order-3 min-w-[180px]">
            <Input
              className="py-4 h-14 w-full"
              appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
              appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5" />
          </div>

          <div className="order-4">
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <div className="bg-surface-soft flex items-center justify-center gap-3 rounded-2xl p-3 h-full cursor-pointer">
                  Price: Ascending
                  <div className="rounded-lg p-1 bg-surface-medium">
                    <Icon name="chevronDown" width={14} height={14} />
                  </div>
                </div>
              )}>
              <Dropdown.Item>Price: Ascending</Dropdown.Item>
              <Dropdown.Item>Price: Descending</Dropdown.Item>
              <Dropdown.Item>Date: Ascending</Dropdown.Item>
              <Dropdown.Item>Date: Descending</Dropdown.Item>
            </Dropdown>
          </div>

        </div>
        <NFTsList
          filters={['status', 'price']}
          onApplyFilters={handleApplyFilters}
          onChangePage={handleChangePage}
          showFilters={showFilters}
          items={items?.data}
          paging={items?.paging}
          traitFilters={data?.traitAvailable}
        />
      </div>
    </div>
  )
}