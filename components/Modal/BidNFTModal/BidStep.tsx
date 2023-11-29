import { APIResponse, MarketEvent } from '@/services/api/types'
import { useBidNFT, useNFTMarketStatus } from '@/hooks/useMarket'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { useForm } from 'react-hook-form'
import { findTokenByAddress } from '@/utils/token'
import { useEffect } from 'react'

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: APIResponse.NFT
  bid: MarketEvent
}

interface FormState {
  price: string
  quantity: string
}

export default function BidStep({ bid, onSuccess, onError, nft }: Props) {
  const { quoteToken } = bid
  const { onBidNFT, isSuccess, isLoading, error } = useBidNFT(nft)
  const { handleSubmit, register } = useForm<FormState>()

  const token = findTokenByAddress(quoteToken)

  const onSubmit = async ({ price, quantity }: FormState) => {
    try {
      await onBidNFT(price, quoteToken, quantity)
    } catch (e: any) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (error) onError(error)
  }, [error])

  useEffect(() => {
    if (isSuccess) onSuccess()
  }, [isSuccess])

  return (
    <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <Text className="text-center" variant="heading-xs">
        Bidding {nft.collection.name} - {nft.name}
      </Text>

      <div>
        <label className="text-body-14 text-secondary font-semibold mb-1">
          {nft.collection.type === 'ERC721' ? 'Price' : 'Price per unit'}
        </label>
        <Input
          register={register('price')}
          type="number" />
      </div>

      <div>
        <label className="text-body-14 text-secondary font-semibold mb-1">Bid using</label>
        <Input
          readOnly
          value={token?.symbol}
        />
      </div>

      {
        nft.collection.type === 'ERC1155' && (
          <div>
            <Text className="text-secondary font-semibold mb-1">Quantity</Text>
            <Input
              register={register('quantity')}
              type="number" />
          </div>
        )
      }

      <Button type={'submit'} className="w-full" loading={isLoading}>
        Purchase item
      </Button>
    </form>
  )
}