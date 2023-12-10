import { APIResponse } from '@/services/api/types'
import { useBuyUsingNative, useNFTMarketStatus } from '@/hooks/useMarket'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { useForm } from 'react-hook-form'
import { formatEther, formatUnits, parseEther } from 'ethers'
import { findTokenByAddress } from '@/utils/token'
import { useEffect, useMemo, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import FormValidationMessages from '@/components/Form/ValidationMessages'
import { bigint } from 'zod'

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: APIResponse.NFT
}

interface FormState {
  quantity: number
}

export default function BuyStep({ onSuccess, onError, nft }: Props) {
  const { address } = useAccount()
  const { data: tokenBalance } = useBalance({
    address: address,
    enabled: !!address
  })
  const { saleData } = useNFTMarketStatus(nft)
  const { onBuyERC721, onBuyERC1155, isSuccess, isLoading, error } = useBuyUsingNative(nft)
  const { handleSubmit, watch, register, formState: { errors } } = useForm<FormState>()
  const quantity = watch('quantity')
  const token = useMemo(() => findTokenByAddress(saleData?.quoteToken), [saleData])

  const totalPriceBN = useMemo(() => {
    if (!quantity) return BigInt(0)
    return BigInt(saleData?.price || '0') * BigInt(quantity)
  }, [quantity])

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
          readOnly
          value={formatUnits(saleData?.price || '0', 18)}
          appendIcon={
            <Text>
              Quantity: {saleData?.amounts}
            </Text>
          } />
      </div>

      <div>
        <label className="text-body-14 text-secondary font-semibold mb-1">Buy using</label>
        <Input
          readOnly
          value={token?.symbol}
          appendIcon={
            <Text>
              Balance: {formatUnits(tokenBalance?.value || 0, 18)}
            </Text>
          }
        />
      </div>

      {
        nft.collection.type === 'ERC1155' && (
          <>
            <div>
              <Text className="text-secondary font-semibold mb-1">Quantity</Text>
              <Input
                error={!!errors.quantity}
                register={register('quantity', {
                  validate: {
                    required: v => (!!v && !isNaN(v) && v > 0) || 'Please input quantity of item to purchase',
                    max: v => v <= Number(saleData?.amounts) || 'Quantity exceeds sale amount',
                    balance: v => {
                      if (!tokenBalance?.value) return 'Not enough balance'
                      const totalPriceBN = BigInt(saleData?.price || 0) * BigInt(v)
                      return totalPriceBN < tokenBalance.value || 'Not enough balance'
                    }
                  }
                })}
                type="number" />
            </div>
            <div>
              <Text className="text-secondary font-semibold mb-1">Estimated cost:</Text>
              <Input
                readOnly
                value={formatEther(totalPriceBN)}
                type="number"
                appendIcon={
                  <Text>
                    U2U
                  </Text>
                } />
            </div>
          </>
        )
      }
      <FormValidationMessages errors={errors} />
      <Button type={'submit'} className="w-full" loading={isLoading}>
        Purchase item
      </Button>
    </form>
  )
}