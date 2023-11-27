import { useState } from 'react'

import { Modal, ModalProps } from 'flowbite-react'
import Text from '@/components/Text'
import defaultAvatar from "@/assets/images/default-avatar.png";
import Image from "next/image";
import Icon from "@/components/Icon";
import Button from '@/components/Button'
import useAuthStore from '@/store/auth/store'
import Link from 'next/link'

export default function ProfileModal({ show, onClose }: ModalProps) {
  const username = useAuthStore(state => state.profile?.username)
  const userId = useAuthStore(state => state.profile?.id)

  return (
    <Modal dismissible position="top-right" show={show} size="sm">
      <Modal.Body>
        <div className="flex justify-between items-centerpy-4">
          <div className="flex gap-3 items-center">
            <Image
              src={defaultAvatar}
              alt="Avatar"
              width={48}
              height={48}
            />
            <Link href={`/user/${userId}`} className="flex flex-col">
              <Text className="text-primary font-semibold" variant="body-18">{username}</Text>
              <Text className="text-secondary">View profile</Text>
            </Link>
          </div>
          <Button variant="icon" onClick={onClose}>
            <Icon name="arrowRight" width={20} height={20} />
          </Button>
        </div>

        <div className="py-4">
          <Link className="text-secondary hover:text-primary" href={"/"} onClick={onClose}>
            Orders
          </Link>
        </div>
        <div className="py-4">
          <Link className="text-secondary hover:text-primary" href={"/create/nft"} onClick={onClose}>
            Create NFT
          </Link>
        </div>
        <div className="py-4">
          <div className="border-b" />
        </div>
        <div className="py-4 w-full">
          <Link className="text-secondary hover:text-primary" href={"/profile"} onClick={onClose}>
            Settings
          </Link>
        </div>
        <div className="py-4">
          <Link href="/" className="text-secondary hover:text-primary" onClick={onClose}>
            Logout
          </Link>
        </div>
      </Modal.Body>
    </Modal>
  )
}
