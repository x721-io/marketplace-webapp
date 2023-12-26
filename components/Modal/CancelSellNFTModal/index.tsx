import { Modal, ModalProps, Tooltip } from 'flowbite-react'
import { APIResponse } from '@/services/api/types'
import { useCancelSellNFT } from '@/hooks/useMarket'
import Text from '@/components/Text'
import Button from '@/components/Button'
import { useMemo } from 'react'
import useAuthStore from '@/store/auth/store'

interface Props extends ModalProps {
  nft: APIResponse.NFT,
}

export default function CancelSellNFTModal({ nft, show, onClose }: Props) {
  const { onCancelSell, isLoading, error, isSuccess } = useCancelSellNFT(nft)
  const wallet = useAuthStore(state => state.profile?.publicKey)
  const mySale = useMemo(() => {
    return nft.sellInfo?.find(item => item.from === wallet?.toLowerCase())
  }, [nft.sellInfo, wallet])

  const handleCancelSell = () => {
    if (!mySale) return
    try {
      onCancelSell(mySale.operationId)
    } catch (e) {
      console.error(e)
    }
  }

  const handleReset = () => {

  }

  return (
    <Modal
      dismissible
      size="md"
      show={show}
      onClose={onClose}>
      <Modal.Body>
        <div className="flex flex-col justify-center gap-4 items-center">
          {
            (() => {
              switch (true) {
                case !!error:
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
                case isSuccess:
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
                        Are you sure to cancel listing?
                      </Text>

                      <div className="flex gap-4">
                        <Button variant="secondary" onClick={onClose}>
                          No
                        </Button>
                        <Button onClick={handleCancelSell} loading={isLoading}>
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