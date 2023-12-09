import Icon from '@/components/Icon'
import Text from '@/components/Text'
import { APIResponse } from '@/services/api/types'
import Link from 'next/link'

interface Props {
  creator: APIResponse.User
  name: string
  floorPrice: string
  volumn: string
  totalNft: number | undefined
  totalOwner: number | undefined
}

export default function InformationSectionCollection({ name,creator, description, floorPrice, totalNft, totalOwner, volumn }: Props) {
  return (
    <>
      <div className="w-full flex justify-between pt-20 desktop:px-20 tablet:px-20 px-4 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-between">
            <Text className="font-semibold desktop:text-body-32 tablet:text-body-32 text-body-24">
              {name}
            </Text>
            <Icon name="verified" width={24} height={24} />
          </div>
          <Link
            href={`/user/${creator?.id}`}
            className="font-semibold desktop:text-body-16 hover:underline">
            Creator: {creator?.username}
          </Link>
          <Text className="text-secondary text-sm">
            <span className="text-primary font-semibold">Description:</span>
            <br/>
            {description}
          </Text>
        </div>
      </div>
      <div className="w-11/12 desktop:w-3/4 tablet:w-3/4 bg-surface-soft rounded-2xl py-3 px-6 flex desktop:mx-20 tablet:mx-20 mx-4 flex-col desktop:flex-row tablet:flex-row gap-3 desktop:gap-0 tablet:gap-0">
        <div className="flex flex-1 justify-around">
          <div className="flex flex-col items-center">
            <Text className="text-secondary">Floor</Text>
            <Text className="text-primary font-bold flex items-center gap-1" variant="body-16">
              {floorPrice} <Text className="text-secondary font-normal">U2U</Text>
            </Text>
          </div>
          <div className="flex flex-col items-center">
            <Text className="text-secondary">Volume</Text>
            <Text className="text-primary font-bold flex items-center gap-1" variant="body-16">
              {volumn} <Text className="text-secondary font-normal">U2U</Text>
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
    </>
  )
}