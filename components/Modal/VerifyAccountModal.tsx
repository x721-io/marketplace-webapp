import { Modal, ModalProps } from 'flowbite-react'
import Text from '../Text'
import Button from '../Button'
import VerifyIcon from '../Icon/Verify'
import { useRouter } from 'next/navigation'

interface FromState extends ModalProps {
  listVerify?: Record<string, any>;
}

export default function VerifyAccountModal({ show, onClose, listVerify }: FromState) {
  const router = useRouter()

  const handleVerifyAccount = () => {
    Object.keys(listVerify || {}).forEach(key => {
      if (listVerify && listVerify[key] === false) {
        switch (key) {
          case 'ownerOrCreater':
            router.push('/create/nft')
            break;
          default:
            break;
        }
      }
    })
    onClose?.();
  };

  return (
    <Modal dismissible onClose={onClose} position="center" show={show} size="sm">
      <Modal.Body>
        <div className='flex flex-col gap-4 p-3'>
          <Text className='text-body-24 font-bold'>Oops</Text>
          <Text className='text-body-16 font-medium'>To begin your verification process you must add following data</Text>
          <div>
            {listVerify && Object.entries(listVerify).map(([key, value]) => (
              <li key={key} className='flex gap-2 items-center'>
                <VerifyIcon width={16} height={16} />
                <Text>{`${key} is required`}</Text>
              </li>
            ))}
          </div>
          <Button onClick={handleVerifyAccount}>Continue</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
