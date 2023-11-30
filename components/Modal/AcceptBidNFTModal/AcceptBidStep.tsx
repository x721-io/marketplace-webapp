import Text from '@/components/Text'
import Button from '@/components/Button'
import { ModalProps } from 'flowbite-react'
import { APIResponse, MarketEvent } from '@/services/api/types'
import { useAcceptBidNFT } from '@/hooks/useMarket'
import { useEffect } from 'react'

interface Props {
  nft: APIResponse.NFT,
  bid?: MarketEvent
  onSuccess: () => void
  onError: (error: Error) => void
  onClose?: () => void
}

export default function AcceptBidStep({ nft, onError, onSuccess, onClose, bid }: Props) {
  const { onAcceptERC721Bid, onAcceptERC1155Bid, isLoading, error, isSuccess } = useAcceptBidNFT(nft)
  const type = nft.collection.type

  const handleAcceptBid = () => {
    if (!bid) return
    try {
      if (type === 'ERC721') {
        onAcceptERC721Bid(bid.to, bid.quoteToken, bid.price)
      } else {
        onAcceptERC1155Bid(bid.operationId, bid.amounts)
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
    <>
      <Text className="font-semibold text-primary text-center mb-4" variant="heading-xs">
        {nft.collection.name} - {nft.name}
      </Text>
      <Text className="text-secondary text-center mb-7" variant="body-18">
        Are you sure to accept this bid?
      </Text>

      <div className="flex gap-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleAcceptBid} loading={isLoading}>
          Yes
        </Button>
      </div>
    </>
  )
}