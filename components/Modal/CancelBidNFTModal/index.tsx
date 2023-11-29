import { Modal, ModalProps } from 'flowbite-react'
import { APIResponse, MarketEvent } from '@/services/api/types'
import { useCancelBidNFT } from '@/hooks/useMarket'
import Text from '@/components/Text'
import Button from '@/components/Button'
import { useMemo } from 'react'

interface Props extends ModalProps {
  nft: APIResponse.NFT,
  bid?: MarketEvent
}

export default function CancelBidNFTModal({ nft, show, onClose, bid }: Props) {
  const { onCancelBid, isLoading, error, isSuccess } = useCancelBidNFT(nft)

  const handleCancelBid = () => {
    if (!bid) return
    try {
      onCancelBid(bid.operationId)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Modal
      dismissible
      size="md"
      show={show}
      onClose={onClose}>
      <Modal.Body>
        <div className="flex flex-col justify-center items-center gap-4">
          {
            (() => {
              switch (true) {
                case !!error:
                  return (
                    <>
                      <Text className="font-semibold text-error text-center text-heading-sm">
                        Error report
                      </Text>
                      <Text className="max-w-full text-secondary text-center text-ellipsis" variant="body-18">
                        {error?.message}
                      </Text>

                      <Button className="w-full" variant="secondary" onClick={onClose}>
                        Close
                      </Button>
                    </>
                  )
                case isSuccess:
                  return (
                    <>
                      <Text className="font-semibold text-success text-center text-heading-sm">
                        Success
                      </Text>
                      <Text className="max-w-full text-secondary text-center text-ellipsis" variant="body-18">
                        You have canceled this bid!
                      </Text>

                      <Button className="w-full" variant="secondary" onClick={onClose}>
                        Close and continue
                      </Button>
                    </>
                  )
                default:
                  return (
                    <>
                      <Text className="font-semibold text-primary text-center mb-4" variant="heading-xs">
                        {nft.collection.name} - {nft.name}
                      </Text>
                      <Text className="text-secondary text-center mb-7" variant="body-18">
                        Are you sure to cancel bidding?
                      </Text>

                      <div className="flex gap-4">
                        <Button variant="secondary" onClick={onClose}>
                          No
                        </Button>
                        <Button onClick={handleCancelBid} loading={isLoading}>
                          Yes
                        </Button>
                      </div>
                    </>
                  )
              }
            })()
          }
        </div>
      </Modal.Body>
    </Modal>
  )
}