import {CustomFlowbiteTheme, Modal, ModalProps, Tooltip} from 'flowbite-react'
import {useState} from 'react'
import Text from '@/components/Text'
import Button from '@/components/Button'
// import ApprovalStep from './ApprovalStep'
import BidStep from "./BidStep";
import {NFT} from '@/types'
import {APIResponse} from '@/services/api/types'
import NFTMarketData = APIResponse.NFTMarketData

interface Props extends ModalProps {
  nft: NFT,
  marketData?: NFTMarketData
}

const modalTheme: CustomFlowbiteTheme['modal'] = {
  content: {
    inner: "relative rounded-lg bg-white shadow flex flex-col h-auto max-h-[600px] desktop:max-h-[800px] tablet:max-h-[800px]",
    base: "relative w-full desktop:p-10 tablet:p-6 p-4 ",
  },
  body: {
    base: "p-0 flex-1 overflow-auto"
  }
}


export default function BidNFTModal({nft, show, onClose, marketData}: Props) {
  const [error, setError] = useState<Error>()
  const [step, setStep] = useState(2)

  const handleReset = () => {
    onClose?.()
    setStep(2)
    setError(undefined)
  }

  const renderContent = () => {
    switch (step) {
       // case 1:
       //   return <ApprovalStep nft={nft} onNext={() => setStep(2)} onError={setError} />
      case 2:
        return <BidStep marketData={marketData} nft={nft} onError={setError} onSuccess={() => setStep(3)}/>
      case 3:
        return (
           <>
             <Text className="font-semibold text-success" variant="heading-sm">
               Success
             </Text>
             <Text className="text-secondary">
               You have successfully placed a bid on {nft.collection.name} - {nft.name}!
             </Text>
             <Button className="w-full" variant="secondary" onClick={handleReset}>
               Close and continue
             </Button>
           </>
        )
      default:
        return <></>
    }
  }

  return (
     <Modal
        theme={modalTheme}
        dismissible
        size="lg"
        show={show}
        onClose={handleReset}>
       <Modal.Body className="p-10">
         <div className="flex flex-col justify-center items-center gap-4">
           {
             !!error ? (
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
             ) : renderContent()
           }
         </div>
       </Modal.Body>
     </Modal>
  )
}