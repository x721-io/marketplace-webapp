import { Modal, ModalProps } from 'flowbite-react'
import Text from '../Text'
import Button from '../Button'
import VerifyIcon from '../Icon/Verify'

interface FromState  extends ModalProps {
  listVerify?: Object | undefined
}

export default function VerifyAccountModal({ show, onClose, listVerify }: FromState) {
  console.log('listVerify', listVerify)

  const handleVerifyAccount = () => {
    onClose?.()
  }

  return (
    <Modal dismissible onClose={onClose} position="center" show={show} size="sm">
      <Modal.Body>
        <div className='flex flex-col gap-4 p-3'>
          <Text className='text-body-24 font-bold'>Oops</Text>
          <Text className='text-body-16 font-medium'>To begin your verification process you must add following data</Text>
          <div>
            {/* {listVerify.map (row => ( */}
              <div className='flex gap-2 items-center'>
              <VerifyIcon width={16} height={16} />
              <Text></Text>
            </div>

            {/* )) } */}
            {/* <div className='flex gap-2 items-center'>
              <VerifyIcon width={16} height={16} />
              <Text>Bio is required</Text>
            </div>
            <div className='flex gap-2 items-center'>
              <VerifyIcon width={16} height={16} />
              <Text>Twitter is required</Text>
            </div>
            <div className='flex gap-2 items-start'>
              <VerifyIcon width={16} height={16} />
              <Text>At least one created or owned NFT in your profile</Text>
            </div> */}
          </div>
          <Button onClick={handleVerifyAccount}>Continue</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
