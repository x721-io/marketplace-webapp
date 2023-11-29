import { APIResponse } from '@/services/api/types'
import { useBuyNFT, useBuyUsingNative, useNFTMarketStatus } from '@/hooks/useMarket'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { useForm } from 'react-hook-form'
import { formatUnits } from 'ethers'
import { findTokenByAddress } from '@/utils/token'
import { useEffect } from 'react'

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: APIResponse.NFT
}

interface FormState {
  quantity: string
}

export default function BuyStep({ onSuccess, onError, nft }: Props) {
  const { saleData } = useNFTMarketStatus(nft)
  const { onBuyERC721, onBuyERC1155, isSuccess, isLoading, error } = useBuyUsingNative(nft)
  const { handleSubmit, register } = useForm<FormState>()

  const token = findTokenByAddress(saleData?.quoteToken)

  const onSubmit = async ({ quantity }: FormState) => {
    if (!saleData) return
    try {
      if (nft.collection.type === 'ERC721') {
        await onBuyERC721(saleData.price)
      } else {
        await onBuyERC1155(saleData.operationId, saleData.price, quantity)
      }
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
        Purchasing {nft.collection.name} - {nft.name}
      </Text>

      <div>
        <label className="text-body-14 text-secondary font-semibold mb-1">Price</label>
        <Input
          value={formatUnits(saleData?.price || '0', 18)}
          type="number" />
      </div>

      <div>
        <label className="text-body-14 text-secondary font-semibold mb-1">Buy using</label>
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