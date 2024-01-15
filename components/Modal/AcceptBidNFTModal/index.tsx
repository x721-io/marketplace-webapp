import { Modal, ModalProps, Tooltip } from 'flowbite-react'
import Text from '@/components/Text'
import Button from '@/components/Button'
import ApprovalStep from './ApprovalStep'
import { useEffect, useState } from 'react'
import AcceptBidStep from '@/components/Modal/AcceptBidNFTModal/AcceptBidStep'
import { NFT, MarketEvent } from '@/types'

interface Props extends ModalProps {
  nft?: NFT,
  bid?: MarketEvent
}

export default function AcceptBidNFTModal({ nft, show, onClose, bid }: Props) {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<Error>()

  const handleReset = () => {
    onClose?.()
    setStep(1)
    setError(undefined)
  }

  const renderContent = () => {
    if (!nft) return null
    switch (step) {
      case 1:
        return <ApprovalStep nft={nft} onNext={() => setStep(2)} onError={setError} />
      case 2:
        return <AcceptBidStep
          nft={nft}
          bid={bid}
          onError={setError}
          onSuccess={() => setStep(3)}
          onClose={handleReset} />
      case 3:
        return (
          <>
            <Text className="font-semibold text-success text-center text-heading-sm">
              Success
            </Text>
            <Tooltip content="Your item has been sold!" placement="bottom">
              <Text className="max-w-full text-secondary text-center text-ellipsis" variant="body-18">
                Your item has been sold!
              </Text>
            </Tooltip>

            <Button className="w-full" variant="secondary" onClick={onClose}>
              Close and continue
            </Button>
          </>
        )
    }
  }

  return (
    <Modal
      dismissible
      size="lg"
      show={show}
      onClose={onClose}>
      <Modal.Body className="p-10">
        <div className="flex flex-col justify-center items-center gap-4">
          {!!error ? (
            <>
              <Text className="font-semibold text-error text-center text-heading-sm">
                Error report
              </Text>
              <Tooltip content={error?.message} placement="bottom">
                <Text className="max-w-full text-secondary text-center text-ellipsis" variant="body-18">
                  {error?.message}
                </Text>
              </Tooltip>

              <Button className="w-full" variant="secondary" onClick={handleReset}>
                Close
              </Button>
            </>
          ) : renderContent()}
        </div>
      </Modal.Body>
    </Modal>
  )
}