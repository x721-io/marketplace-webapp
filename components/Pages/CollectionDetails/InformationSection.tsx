import Icon from '@/components/Icon'
import Text from '@/components/Text'
import { APIResponse } from '@/services/api/types'
import Link from 'next/link'
import { formatEther } from 'ethers'
import { useMemo, useState } from 'react'
import { formatDisplayedBalance } from '@/utils'
import { useReadCollectionRoyalties } from '@/hooks/useRoyalties'
import Button from '@/components/Button'
import { Royalty } from '@/types'
import UpdateRoyaltiesModal from '@/components/Modal/UpdateRoyaltiesModal'

interface Props {
  data: APIResponse.CollectionDetails
}

export default function InformationSectionCollection({ data }: Props) {
  const [showRoyaltiesModal, setShowRoyaltiesModal] = useState(false)
  const { floorPrice, volumn, totalNft, totalOwner } = useMemo(() => data.generalInfo, [data.generalInfo])
  const creator = useMemo(() => {
    if (!data.collection.creators[0]) return undefined
    return data.collection.creators[0].user
  }, [data.collection])

  const { data: royalties } = useReadCollectionRoyalties(data.collection.address)
  const displayedRoyalties = useMemo(() => {
    if (!royalties?.length) return 0

    const totalRoyaltiesValue = royalties.reduce((accumulator: bigint, current: Royalty) => BigInt(current.value) + BigInt(accumulator), BigInt(0))
    return Number(totalRoyaltiesValue) / 100
  }, [royalties])

  return (
    <>
      <div className="w-full flex justify-between pt-20 desktop:px-20 tablet:px-20 px-4 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Text className="font-semibold text-primary desktop:text-body-32 tablet:text-body-32 text-body-24">
              {data.collection.name}
            </Text>
            {/* <Icon name="verified" width={24} height={24} /> */}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/user/${creator?.id}`}
              className="font-semibold text-secondary text-body-16 hover:underline">
              Creator: <span className="text-primary font-bold">{creator?.username}</span>
            </Link>
            <div className="bg-surface-hard h-4 w-[1px]" />
            <Text className="font-semibold text-primary text-body-16">
              Royalties:
            </Text>
            <div className="rounded-lg px-3 bg-warning text-white text-body-16 font-bold">
              {displayedRoyalties}%
            </div>
            <Button variant="icon" onClick={() => setShowRoyaltiesModal(true)}>
              <Icon name="settings" width={12} height={12} />
            </Button>
          </div>
          <Text className="text-secondary text-body-16 font-semibold">
            Symbol: <span className="text-primary font-bold">{data.collection.symbol}</span>
          </Text>
          <Text className="text-secondary">
            {data.collection.description}
          </Text>
        </div>
      </div>

      <div className="w-11/12 desktop:w-3/4 tablet:w-3/4 bg-surface-soft rounded-2xl py-3 px-6 flex desktop:mx-20 tablet:mx-20 mx-4 flex-col desktop:flex-row tablet:flex-row gap-3 desktop:gap-0 tablet:gap-0">
        <div className="flex flex-1 justify-around">
          <div className="flex flex-col items-center">
            <Text className="text-secondary">Floor</Text>
            <Text className="text-primary font-bold flex items-center gap-1" variant="body-16">
              {formatDisplayedBalance(formatEther(floorPrice || 0), 2)}
              <span className="text-secondary font-normal">U2U</span>
            </Text>
          </div>
          <div className="flex flex-col items-center">
            <Text className="text-secondary">Volume</Text>
            <Text className="text-primary font-bold flex items-center gap-1" variant="body-16">
              {formatDisplayedBalance(formatEther(volumn || 0), 2)}
              <span className="text-secondary font-normal">U2U</span>
            </Text>
          </div>
          <div className="flex flex-col items-center">
            <Text className="text-secondary">Items</Text>
            <Text className="text-primary font-bold" variant="body-16">
              {totalNft}
            </Text>
          </div>
          <div className="flex flex-col items-center">
            <Text className="text-secondary">Owner</Text>
            <Text className="text-primary font-bold" variant="body-16">
              {totalOwner}
            </Text>
          </div>
        </div>
      </div>

      <UpdateRoyaltiesModal
        show={showRoyaltiesModal}
        onClose={() => setShowRoyaltiesModal(false)}
        collection={data.collection} />
    </>
  )
}