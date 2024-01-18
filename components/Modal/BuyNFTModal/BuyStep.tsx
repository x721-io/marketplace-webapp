import { useBuyUsingNative } from '@/hooks/useMarket'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { useForm } from 'react-hook-form'
import { formatEther, formatUnits } from 'ethers'
import { findTokenByAddress } from '@/utils/token'
import { useEffect, useMemo } from 'react'
import { useAccount, useBalance } from 'wagmi'
import FormValidationMessages from '@/components/Form/ValidationMessages'
import { NFT, MarketEvent, FormState } from '@/types'
import FeeCalculator from '@/components/FeeCalculator'
import { formatDisplayedBalance } from '@/utils'
import { numberRegex } from '@/utils/regex'

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: NFT
  saleData?: MarketEvent
}

export default function BuyStep({ onSuccess, onError, saleData, nft }: Props) {
  const { address } = useAccount()
  const { data: tokenBalance } = useBalance({
    address: address,
    enabled: !!address
  })
  const { onBuyERC721, onBuyERC1155, isSuccess, isLoading, error } = useBuyUsingNative(nft)
  const { handleSubmit, watch, register, formState: { errors } } = useForm<FormState.BuyNFT>()
  const quantity = watch('quantity')
  const token = useMemo(() => findTokenByAddress(saleData?.quoteToken), [saleData])

  const totalPriceBN = useMemo(() => {
    if (!quantity) return BigInt(0)
    return BigInt(saleData?.price || '0') * BigInt(quantity)
  }, [quantity])

  const onSubmit = async ({ quantity }: FormState.BuyNFT) => {
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
      <div className="font-bold">
        <Text className="mb-3" variant="heading-xs">
          Purchase NFT
        </Text>
        <Text className="text-secondary" variant="body-16">
          Filling sell order
          for <span className="text-primary font-bold">{nft.name}</span> from <span className="text-primary font-bold">{nft.collection.name}</span> collection
        </Text>
      </div>

      <div>
        <label className="text-body-14 text-secondary font-semibold mb-1">Price</label>
        <Input
          readOnly
          value={formatUnits(saleData?.price || '0', 18)}
          appendIcon={nft.collection.type === 'ERC1155' &&
            <Text>
              Quantity: {saleData?.quantity}
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
              Balance: {formatDisplayedBalance(formatUnits(tokenBalance?.value || 0, 18))}
            </Text>
          }
          // @ts-ignore
          error={ tokenBalance?.value < saleData?.price }
        />
      </div>

      {nft.collection.type === 'ERC721' && (
        <FeeCalculator quoteToken={saleData?.quoteToken} mode="buyer" price={BigInt(saleData?.price || 0)} nft={nft} />
      )}

      {nft.collection.type === 'ERC1155' && (
        <>
          <div>
            <Text className="text-secondary font-semibold mb-1">Quantity</Text>
            <Input
              error={!!errors.quantity}
              register={register('quantity', {
                pattern: { value: numberRegex, message: 'Wrong number format' },
                validate: {
                  required: v => (!!v && !isNaN(v) && v > 0) || 'Please input quantity of item to purchase',
                  max: v => v <= Number(saleData?.quantity) || 'Quantity exceeds sale amount',
                  balance: v => {
                    if (!tokenBalance?.value) return 'Not enough balance'
                    const totalPriceBN = BigInt(saleData?.price || 0) * BigInt(v)
                    return totalPriceBN < tokenBalance.value || 'Not enough balance'
                  }
                }
              })} />
          </div>

          <div>
            <Text className="text-secondary font-semibold mb-1">Estimated cost:</Text>
            <Input
              readOnly
              value={formatDisplayedBalance(formatEther(totalPriceBN))}
              appendIcon={
                <Text>
                  U2U
                </Text>
              } />
          </div>

          <FeeCalculator mode="buyer" price={totalPriceBN} nft={nft} quoteToken={token?.address} />
        </>
      )}

      <FormValidationMessages errors={errors} />
      <Button type={'submit'} className="w-full" loading={isLoading}>
        Purchase item
      </Button>
    </form>
  )
}