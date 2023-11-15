import Button, { ButtonProps } from './index'
import { useState } from 'react'
import SignupModal from '@/components/Modal/SignupModal'

export default function ConnectWalletButton(props: ButtonProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button {...props} onClick={() => setOpenModal(true)}>
        Connect Wallet
      </Button>
      <SignupModal show={openModal} onClose={() => setOpenModal(false)} />
    </>
  )
}