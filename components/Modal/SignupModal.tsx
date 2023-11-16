"use client"

import { Checkbox, Label, Modal, ModalProps } from 'flowbite-react'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import { useState } from 'react'
import Button from '@/components/Button'

export default function SignupModal({ show, onClose }: ModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(false)

  const handleSignup = () => {
    if (!agree) return
    try {

    } catch (e) {
      console.error('Error signing up:', e)
    }
  }

  return (
    <Modal dismissible show={show} onClose={onClose} size="lg">
      <Modal.Body>
        <div className="max-w-[400px] mx-auto flex flex-col gap-8 py-8">
          <Text className="font-semibold text-primary text-center" variant="heading-md">
            Sign-up to U2 NFT!
          </Text>
          <Text className="text-secondary text-center" variant="body-18">
            Choose a display name and enter your
            email address to receive updates when
            your NFTs sell or receive offers.
          </Text>

          <div className="flex flex-col gap-5">
            <Input
              placeholder="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex gap-5 items-center">
              <Checkbox
                id="accept"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <Label htmlFor="accept" className="text-body-16 text-tertiary cursor-pointer">
                I have read and accept the <a href="#" className="text-primary">Terms of Service</a>,
                the <a href="#" className="text-primary">Term of Creator</a> and confirm that I am at least 13 years old
              </Label>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <Button disabled={!agree}>
              Finish sign-up
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}