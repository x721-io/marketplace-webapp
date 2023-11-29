import { APIResponse } from '@/services/api/types'
import { useBuyNFT, useBuyUsingNative, useNFTMarketStatus } from '@/hooks/useMarket'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { useForm } from 'react-hook-form'
import { formatUnits } from 'ethers'
import { findTokenByAddress } from '@/utils/token'
import { useEffect, useMemo, useState } from 'react'
import { fetchBalance, FetchBalanceResult } from '@wagmi/core'
import { tokens } from '@/config/tokens'
import { useAccount } from 'wagmi'

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: APIResponse.NFT
}

interface FormState {
  quantity: string
}

export default function BuyStep({ onSuccess, onError, nft }: Props) {
  const { address } = useAccount()
  const [tokenBalance, setTokenBalance] = useState<FetchBalanceResult>()
  const { saleData } = useNFTMarketStatus(nft)
  const { onBuyERC721, onBuyERC1155, isSuccess, isLoading, error } = useBuyUsingNative(nft)
  const { handleSubmit, watch, register } = useForm<FormState>()
  const quantity = watch('quantity')

  const token = useMemo(() => findTokenByAddress(saleData?.quoteToken), [saleData])

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

  useEffect(() => {
    (async () => {
      if (!address) return

      const balance = await fetchBalance({
        address,
        // token: quoteToken
      })
      setTokenBalance(balance)
    })()
  }, [address]);

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
                register={register('quantity')}
                type="number" />
            </div>
            <div>
              <Text className="text-secondary font-semibold mb-1">Estimated cost:</Text>
              <Input
                readOnly
                value={Number(saleData?.price || '0') * Number(quantity)}
                type="number"
                appendIcon={
                  <Text>
                    U2U
                  </Text>
                }/>
            </div>
          </>
        )
      }

      <Button type={'submit'} className="w-full" loading={isLoading}>
        Purchase item
      </Button>
    </form>
  )
}