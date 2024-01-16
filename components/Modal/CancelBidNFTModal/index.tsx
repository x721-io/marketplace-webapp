import {CustomFlowbiteTheme, Modal, ModalProps, Tooltip} from 'flowbite-react'
import {useCancelBidNFT} from '@/hooks/useMarket'
import Text from '@/components/Text'
import Button from '@/components/Button'
import {NFT, MarketEvent} from '@/types'
import {useEffect, useState} from 'react'

interface Props extends ModalProps {
  nft: NFT,
  bid?: MarketEvent | undefined
}

const modalTheme: CustomFlowbiteTheme['modal'] = {
  content: {
    inner: "relative rounded-lg bg-white shadow flex flex-col tablet:h-auto h-auto desktop:h-auto ",
    base: "relative w-full p-10 desktop:h-auto tablet:h-auto max-h-[90vh]",
  },
  body: {
    base: "p-0 flex-1 overflow-auto"
  }
}

export default function CancelBidNFTModal({nft, show, onClose, bid}: Props) {
  const {onCancelBid, isLoading, error, isSuccess} = useCancelBidNFT(nft)
  const [step, setStep] = useState(1)

  const handleCancelBid = () => {
    if (!bid) return
    try {
      onCancelBid(bid.operationId)
    } catch (e) {
      console.error(e)
    }
  }

  const handleReset = () => {
    onClose?.()
    setStep(1)
  }

  const renderContent = () => {
    switch (step) {
      case 3:
        return (
           <>
             <Text className="font-semibold text-error text-center text-heading-sm">
               Error report
             </Text>
             <Tooltip content={error?.message} placement="bottom">
               <Text className="max-w-full text-secondary text-center text-ellipsis" variant="body-18">
                 {error?.message}
               </Text>
             </Tooltip>

             <Button className="w-full" variant="secondary" onClick={onClose}>
               Close
             </Button>
           </>
        )
      case 2:
        return (
           <>
             <Text className="font-semibold text-success text-center text-heading-sm">
               Success
             </Text>
             <Tooltip content="You have canceled this bid!" placement="bottom">
               <Text className="max-w-full text-secondary text-center text-ellipsis" variant="body-18">
                 You have canceled this bid!
               </Text>
             </Tooltip>

             <Button className="w-full" variant="secondary" onClick={handleReset}>
               Close and continue
             </Button>
           </>
        )
      case 1:
      default:
        return (
          <>
            <div className="font-bold">
              <Text className="mb-3 text-center" variant="heading-xs">
                Cancel Bidding
              </Text>
              <Text className="text-secondary" variant="body-16">
                Cancel sale
                for <span className="text-primary font-bold">{nft.name}</span> from <span className="text-primary font-bold">{nft.collection.name}</span> collection
              </Text>
            </div>

             <div className="flex gap-4">
               <Button variant="secondary" onClick={handleReset}>
                 No
               </Button>
               <Button onClick={handleCancelBid} loading={isLoading}>
                 Yes
               </Button>
             </div>
           </>
        )
    }
  }

  useEffect(() => {
    if (error) {
      setStep(3)
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      setStep(2)
    }
  }, [isSuccess]);

  if (!bid) return null

  return (
     <Modal
        theme={modalTheme}
        dismissible
        size="md"
        show={show}
        onClose={onClose}>
       <Modal.Body>
         <div className="flex flex-col justify-center items-center gap-4 ">
           {renderContent()}
         </div>
       </Modal.Body>
     </Modal>
  )
}