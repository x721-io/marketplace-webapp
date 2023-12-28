import Text from '@/components/Text'
import Button from '@/components/Button'
import { useAcceptBidNFT } from '@/hooks/useMarket'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '@/components/Form/Input'
import FormValidationMessages from '@/components/Form/ValidationMessages'
import { NFT, MarketEvent, FormState } from '@/types'

interface Props {
  nft: NFT,
  bid?: MarketEvent
  onSuccess: () => void
  onError: (error: Error) => void
  onClose?: () => void
}

export default function AcceptBidStep({ nft, onError, onSuccess, onClose, bid }: Props) {
  const { onAcceptERC721Bid, onAcceptERC1155Bid, isLoading, error, isSuccess } = useAcceptBidNFT(nft)
  const { handleSubmit, register, formState: { errors } } = useForm<FormState.AcceptBidNFT>({
    defaultValues: {
      quantity: bid?.amounts ? Number(bid.amounts) : 0
    }
  })
  const type = nft.collection.type

  const onSubmit = ({ quantity }: FormState.AcceptBidNFT) => {
    if (!bid) return
    try {
      if (type === 'ERC721') {
        onAcceptERC721Bid(bid.to, bid.quoteToken, bid.price)
      } else {
        onAcceptERC1155Bid(bid.operationId, quantity)
      }
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text className="font-semibold text-primary text-center mb-4" variant="heading-xs">
        {nft.collection.name} - {nft.name}
      </Text>
      {
        type === 'ERC721' ? (
          <Text className="text-secondary text-center mb-4" variant="body-18">
            Are you sure to accept this bid?
          </Text>
        ) : (
          <Input
            error={!!errors.quantity}
            type="number"
            appendIcon={
              <Text>
                Available: {bid?.amounts}
              </Text>
            }
            register={
              register(
                'quantity',
                {
                  validate: {
                    required: v => !!v && v > 0 && !isNaN(v) || 'Please input quantity',
                    amount: v => (v <= Number(bid?.amounts)) || 'Quantity cannot exceed bid amount'
                  }
                }
              )}
          />
        )
      }
      <FormValidationMessages errors={errors} />

      <div className="flex gap-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          Accept bid
        </Button>
      </div>
    </form>
  )
}