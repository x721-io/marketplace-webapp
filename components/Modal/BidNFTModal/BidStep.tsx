import { APIResponse } from '@/services/api/types'
import { useBidNFT, useBidUsingNative, useNFTMarketStatus } from '@/hooks/useMarket'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { useForm } from 'react-hook-form'
import { findTokenByAddress } from '@/utils/token'
import { useEffect, useState } from 'react'
import { tokens } from '@/config/tokens'
import { fetchBalance, FetchBalanceResult } from '@wagmi/core'
import { useAccount } from 'wagmi'
import { formatEther, formatUnits } from 'ethers'

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: APIResponse.NFT
}

interface FormState {
  price: string
  quantity: string
}

export default function BidStep({ onSuccess, onError, nft }: Props) {
  const { address } = useAccount()
  const [tokenBalance, setTokenBalance] = useState<FetchBalanceResult>()
  const token = tokens.wu2u

  const { onBidUsingNative, isSuccess, isLoading, error } = useBidUsingNative(nft)
  const { handleSubmit, watch, register } = useForm<FormState>()
  const [price, quantity] = watch(['price', 'quantity'])

  const onSubmit = async ({ price, quantity }: FormState) => {
    try {
      await onBidUsingNative(price, quantity)
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
                value={Number(price) * Number(quantity)}
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
        Place bid
      </Button>
    </form>
  )
}