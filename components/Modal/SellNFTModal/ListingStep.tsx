import Text from "@/components/Text";
import Input from "@/components/Form/Input";
import { useEffect, useMemo } from "react";
import { useSellNFT } from "@/hooks/useMarket";
import Button from "@/components/Button";
import Select from '@/components/Form/Select'
import { tokenOptions } from '@/config/tokens'
import { useForm } from 'react-hook-form'
import useAuthStore from '@/store/auth/store'
import FormValidationMessages from '@/components/Form/ValidationMessages'
import { FormState, NFT } from '@/types'
import { APIResponse } from '@/services/api/types'
import NFTMarketData = APIResponse.NFTMarketData

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: NFT
  marketData?: NFTMarketData | undefined
}

export default function ListingStep({ nft, onSuccess, onError, marketData }: Props) {
  const type = nft.collection.type
  const wallet = useAuthStore(state => state.profile?.publicKey)
  const ownerData = useMemo(() => {
    if (!wallet || !marketData) return undefined
    return marketData.owners.find(owner => owner.publicKey.toLowerCase() === wallet.toLowerCase())
  }, [wallet, nft])
  const { register, handleSubmit, formState: { errors } } = useForm<FormState.SellNFT>()
  const { onSellNFT, isLoading, isError, error, isSuccess } = useSellNFT(nft)

  const formRules = {
    price: {
      required: 'Please input price',
      validate: {
        isNumber: (v: number) => !isNaN(v) || 'Please input a valid price number',
        max: (v: number) =>  Number(v) < 10e15 - 1 || 'Please input a safe price number',
        decimals: (v: number) => {
          const decimalPart = (v.toString().split('.')[1] || '').length;
          return decimalPart <= 18 || 'The decimal length of the price cannot exceed 18 decimal digits of the token';
        }
      }
    },
    quantity: {
      validate: {
        required: (v: number) => {
          if (type === 'ERC721') return true
          return (!!v && !isNaN(v) && v > 0) || 'Please input quantity of item to sell'
        },
        amount: (v: number) => {
          if (type === 'ERC721') return true
          if (!ownerData) return 'Quantity exceeds owned amount'
          return v <= Number(ownerData.quantity) || 'Quantity exceeds owned amount'
        }
      }
    }
  }

  const onSubmit = async ({ price, quoteToken, quantity }: FormState.SellNFT) => {
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
          error={!!errors.price}
          register={register('price', formRules.price)} />
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
              error={!!errors.quantity}
              register={register('quantity', formRules.quantity)}
              type="number"
              appendIcon={
                <Text className="mr-5">
                  Owned: {ownerData?.quantity}
                </Text>
              }/>
          </div>
        )
      }
      <FormValidationMessages errors={errors} />
      <Button type={'submit'} className="w-full" loading={isLoading}>
        Put on sale
      </Button>
    </form>
  )
}