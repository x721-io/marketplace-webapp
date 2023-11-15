"use client"

import { Checkbox, Label, Modal, ModalProps } from 'flowbite-react'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import { useState } from 'react'
import Button from '@/components/Button'

export default function WalletConnectModal({ show, onClose }: ModalProps) {

  return (
    <Modal dismissible show={show} onClose={onClose} size="lg">
      <Modal.Body>
      </Modal.Body>
    </Modal>
  )
}