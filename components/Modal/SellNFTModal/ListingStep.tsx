import { APIResponse } from "@/services/api/types";
import Text from "@/components/Text";
import Input from "@/components/Form/Input";
import { useEffect } from "react";
import { useSellNFT } from "@/hooks/useMarket";
import Button from "@/components/Button";
import { Address } from 'wagmi'
import Select from '@/components/Form/Select'
import { tokenOptions } from '@/config/tokens'
import { useForm } from 'react-hook-form'

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: APIResponse.NFT
}

interface FormState {
  price: string
  quantity: string
  quoteToken: Address
}

export default function ListingStep({ nft, onSuccess, onError }: Props) {
  const { register, handleSubmit } = useForm<FormState>()
  const { onSellNFT, isLoading, isError, error, isSuccess } = useSellNFT(nft)

  const onSubmit = async ({ price, quoteToken, quantity }: FormState) => {
    try {
      onSellNFT(price, quoteToken, quantity)
    } catch (e) {
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
        Create Sell Order
      </Text>

      <div>
        <label className="text-body-14 text-secondary font-semibold mb-1">Price</label>
        <Input
          register={register('price')}
          type="number" />
      </div>

      <div>
        <label className="text-body-14 text-secondary font-semibold mb-1">Sell using</label>
        <Select
          options={tokenOptions}
          register={register('quoteToken')}
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
        Put on sale
      </Button>
    </form>
  )
}