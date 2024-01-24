import { Modal, ModalProps } from 'flowbite-react'

export default function VerifyAccountModal({ show, onClose }: ModalProps) {

  return (
    <Modal dismissible onClose={onClose} position="center" show={show} size="sm">
      <Modal.Body>
        Ahihi
      </Modal.Body>
    </Modal>
  )
}
