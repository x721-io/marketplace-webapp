import { Modal, ModalProps } from 'flowbite-react'
import { APIResponse } from '@/services/api/types'
import { useCancelSellNFT } from '@/hooks/useMarket'
import Text from '@/components/Text'
import Button from '@/components/Button'

interface Props extends ModalProps {
  nft: APIResponse.NFT,
}

export default function CancelSellNFTModal({ nft, show, onClose }: Props) {
  const { onCancelSell, isLoading, error } = useCancelSellNFT(nft)

  const handleCancelBid = () => {
    try {
      onCancelSell()
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
        <div className="flex flex-col justify-center items-center">
          {
            !!error ? (
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
            ) : (
              <>
                <Text className="font-semibold text-primary text-center mb-4" variant="heading-xs">
                  {nft.collection.name} - {nft.name}
                </Text>
                <Text className="text-secondary text-center mb-7" variant="body-18">
                  Are you sure to cancel listing?
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

        </div>
      </Modal.Body>
    </Modal>
  )
}