import Image from 'next/image'
import Icon from '@/components/Icon'
import Text from '@/components/Text'
import Button from '@/components/Button'
import NFTActions from './NFTActions'
import { useNFTMarketStatus } from '@/hooks/useMarket'
import { formatUnits } from 'ethers'
import Link from 'next/link'
import { Tooltip } from 'flowbite-react'
import { NFT } from '@/types'
import { APIResponse } from '@/services/api/types'
import { getUserAvatarImage, truncate } from '@/utils/string'

export default function NFTMarketData({ nft, marketData }: { nft: NFT, marketData?: APIResponse.NFTMarketData }) {
  const type = nft.collection.type

  if (!marketData) {
    return null
  }

  const { isOnSale, saleData } = useNFTMarketStatus(type, marketData)

  return (
    <div className="flex flex-col gap-10 justify-between w-full">
      {/* NFT info */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 items-center">
          {/* <Icon name="verified" width={16} height={16} /> */}
          <Link href={`/collection/${nft.collection.id}`} className="text-secondary underline">
            {nft.collection.name}
          </Link>
        </div>

        <Tooltip content={nft.name} placement="bottom">
          <div className="desktop:max-w-[350px] tablet:max-w-[350px] w-full overflow-hidden">
            <Text className="font-bold text-primary desktop:text-body-40 tablet:text-body-40 text-body-24 text-ellipsis"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              {nft.name}
            </Text>
          </div>
        </Tooltip>

        {!!nft.creator && (
          <Text className="text-secondary" variant="body-16">
            Created by {' '}
            <Link href={`/user/${nft.creator.id}`} className="text-primary underline">
              {nft.creator.username}
            </Link>
          </Text>
        )}

        {
          type === 'ERC721' && (
            <div className="flex items-center gap-2">
              <Text className="text-secondary" variant="body-16">
                Current Owner:
              </Text>
              <Link
                className="hover:underline flex items-center gap-1"
                href={`/user/${marketData.owners[0].id || marketData.owners[0].signer}`}>
                <Image
                  width={56}
                  height={56}
                  className="w-6 h-6 rounded-full"
                  src={marketData.owners[0].avatar || getUserAvatarImage(marketData.owners[0])}
                  alt="avatar" />
                {marketData.owners[0].username || truncate({str: marketData.owners[0].signer})}
              </Link>
            </div>
          )
        }
      </div>

      <div className="inline-flex gap-3">
        <Button variant="secondary" disabled>
          <Icon name="share" width={16} height={16} />
          Share
        </Button>
        <Button variant="secondary" disabled>
          <Icon name="refresh" width={16} height={16} />
          Refresh metadata
        </Button>
        <Button variant="icon" disabled>
          <Icon name="moreVertical" width={16} height={16} />
        </Button>
      </div>

      {/* Actions */}
      <div className="bg-surface-soft shadow rounded-2xl p-3">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <Text className="text-secondary mb-2 font-semibold" variant="body-16">
                {type === 'ERC1155' && 'Best '}Price
              </Text>
              {isOnSale ? (
                <div className="flex items-start justify-between">
                  <Text variant="heading-md">
                    <span className="text-primary font-semibold">
                      {Number(formatUnits(saleData?.price || 0)).toLocaleString('en-US')}
                    </span>&nbsp;
                    <span className="text-secondary">U2U</span>
                  </Text>
                </div>
              ) : <Text># Not for sale</Text>}
            </div>

            {
              type === 'ERC1155' && isOnSale && (
                <div>
                  <Text className="text-secondary mb-2 font-semibold text-right" variant="body-16">
                    Quantity
                  </Text>
                  <Text className="text-right" variant="heading-md">
                    {saleData?.quantity}
                  </Text>
                </div>
              )
            }
          </div>

        </div>

        <NFTActions nft={nft} marketData={marketData} />
      </div>
    </div>
  )
}