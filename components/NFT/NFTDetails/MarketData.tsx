import Image from 'next/image'
import Icon from '@/components/Icon'
import { APIResponse } from '@/services/api/types'
import Text from '@/components/Text'
import Button from '@/components/Button'
import NFTActions from '@/components/NFT/NFTDetails/NFTActions'
import { useNFTMarketStatus } from '@/hooks/useMarket'
import { formatUnits } from 'ethers'
import { parseImageUrl } from '@/utils/nft'
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import Link from 'next/link'

export default function NFTMarketData({ nft }: { nft: APIResponse.NFT }) {
  const type = nft.collection.type
  const { isOnSale, saleData } = useNFTMarketStatus(nft)

  return (
    <div className="flex flex-col gap-10 justify-between">
      {/* NFT info */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 items-center">
          <Icon name="verified" width={16} height={16} />
          <Text className="text-secondary">
            {nft.collection.name}
          </Text>
        </div>

        <Text className="font-bold text-primary desktop:text-body-40 tablet:text-body-40 text-body-24">
          {nft.name}
        </Text>

        <Text className="text-secondary" variant="body-16">
          Created by <Link href={`/user/${nft.creator.id}`}
                           className="text-primary underline">{nft.creator.username}</Link>
        </Text>

        <div>
          <Text className="text-secondary mb-2" variant="body-16">
            Owner{type === 'ERC1155' && `(s): ${nft.owners.length}`}
          </Text>
          {
            nft.owners.map(owner => (
              <div className="flex items-center gap-2" key={owner.publicKey}>
                <Link
                  className="hover:underline flex items-center gap-1 px-2"
                  href={`/user/${owner.publicKey}`}>
                  <Image
                    width={56}
                    height={56}
                    className="w-6 h-6 rounded-full"
                    src={owner.avatar ? parseImageUrl(owner.avatar) : defaultAvatar}
                    alt="avatar" />
                  {owner.username}
                </Link>
                {type === 'ERC1155' && (
                  <>
                    -
                    <Text> quantity: {owner.quantity}</Text>
                  </>
                )}
              </div>
            ))
          }
        </div>
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
                Price
              </Text>
              {
                isOnSale ? (
                  <div className="flex items-start justify-between">
                    <Text variant="heading-md">
                      <span className="text-primary font-semibold">
                        {formatUnits(saleData?.price || '0')}
                      </span>&nbsp;
                      <span className="text-secondary">U2U</span>
                    </Text>
                  </div>
                ) : (
                  <Text>
                    # Not for sale
                  </Text>
                )
              }
            </div>

            {
              type === 'ERC1155' && isOnSale && (
                <div>
                  <Text className="text-secondary mb-2 font-semibold text-right" variant="body-16">
                    Quantity
                  </Text>
                  <Text className="text-right" variant="heading-md">
                    {saleData?.amounts}
                  </Text>
                </div>
              )
            }
          </div>

        </div>

        <NFTActions {...nft} />
      </div>
    </div>
  )
}