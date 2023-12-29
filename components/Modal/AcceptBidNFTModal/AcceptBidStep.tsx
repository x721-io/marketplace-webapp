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
      quantity: bid?.quantity ? Number(bid.quantity) : 0
    }
  })
  const type = nft.collection.type

  const onSubmit = ({ quantity }: FormState.AcceptBidNFT) => {
    if (!bid || !bid.to?.signer) return
    try {
      if (type === 'ERC721') {
        onAcceptERC721Bid(bid.to.signer, bid.quoteToken, bid.price)
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
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <Text className="font-semibold text-primary text-center mb-4" variant="heading-xs">
        {nft.collection.name} - {nft.name}
      </Text>
      {
        type === 'ERC721' ? (
          <Text className="text-secondary text-center mb-7" variant="body-18">
            Are you sure to accept this bid?
          </Text>
        ) : (
          <>
            <label className="text-body-14 text-secondary" htmlFor="">Quantity:</label>
            <Input
              error={!!errors.quantity}
              type="number"
              appendIcon={
                <Text>
                  Available: {bid?.quantity}
                </Text>
              }
              register={
                register(
                  'quantity',
                  {
                    validate: {
                      required: v => !!v && v > 0 && !isNaN(v) || 'Please input quantity',
                      amount: v => (v <= Number(bid?.quantity)) || 'Quantity cannot exceed bid amount'
                    }
                  }
                )}
            />
          </>

        )
      }
      <FormValidationMessages errors={errors} />

      <div className="flex gap-4 mt-7 w-full">
        <Button className="flex-1" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" type="submit" loading={isLoading}>
          Accept bid
        </Button>
      </div>
    </form>
  )
}