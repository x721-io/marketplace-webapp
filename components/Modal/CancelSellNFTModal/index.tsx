import {CustomFlowbiteTheme, Modal, ModalProps, Tooltip} from 'flowbite-react'
import {useCancelSellNFT} from '@/hooks/useMarket'
import Text from '@/components/Text'
import Button from '@/components/Button'
import {useEffect, useMemo, useState} from 'react'
import useAuthStore from '@/store/auth/store'
import {NFT} from '@/types/entitites'
import {APIResponse} from '@/services/api/types'
import NFTMarketData = APIResponse.NFTMarketData

interface Props extends ModalProps {
  nft: NFT,
  marketData?: NFTMarketData
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

export default function CancelSellNFTModal({nft, show, onClose, marketData}: Props) {
  const [step, setStep] = useState(1)
  const {onCancelSell, isLoading, error, isSuccess} = useCancelSellNFT(nft)
  const wallet = useAuthStore(state => state.profile?.publicKey)
  const mySale = useMemo(() => {
    return marketData?.sellInfo?.find(item => item.from?.signer?.toLowerCase() === wallet?.toLowerCase())
  }, [marketData, wallet])

  const handleCancelSell = () => {
    try {
      onCancelSell(mySale?.operationId)
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
      case 3: // Error
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
      case 2: // Success
        return (
           <>
             <Text className="font-semibold text-success text-center text-heading-sm">
               Success
             </Text>
             <Tooltip content="Sale has been cancelled" placement="bottom">
               <Text className="max-w-full text-secondary text-center text-ellipsis" variant="body-18">
                 Sale has been cancelled
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
           <div className='flex flex-col items-center justify-center gap-4'>
             <Text className="font-semibold text-primary text-center" variant="heading-xs">
               {nft.collection.name} - {nft.name}
             </Text>
             <Text className="text-secondary text-center" variant="body-18">
               Are you sure to cancel listing?
             </Text>

             <div className="flex gap-4">
               <Button variant="secondary" onClick={handleReset}>
                 No
               </Button>
               <Button onClick={handleCancelSell} loading={isLoading}>
                 Yes
               </Button>
             </div>
           </div>
        )
    }
  }

  useEffect(() => {
    if (error) {
      setStep(3)
    }
    if (isSuccess) {
      setStep(2)
    }
  }, [error, isSuccess])

  return (
     <Modal
        theme={modalTheme}
        dismissible
        size="md"
        show={show}
        onClose={onClose}>
       <Modal.Body className="p-10">
         <div className="flex flex-col justify-center gap-4 items-center">
           {renderContent()}
         </div>
       </Modal.Body>
     </Modal>
  )
}