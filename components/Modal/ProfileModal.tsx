import { Modal, ModalProps } from 'flowbite-react'
import Text from '@/components/Text'
import defaultAvatar from "@/assets/images/default-avatar.png";
import Image from "next/image";
import Icon from "@/components/Icon";
import Button from '@/components/Button'
import useAuthStore from '@/store/auth/store'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { tokens } from '@/config/tokens'
import { useBalance, useContractWrite } from 'wagmi'
import WETH_ABI from '@/abi/WETH.json'
import { useTransactionStatus } from '@/hooks/useTransactionStatus'
import { toast } from 'react-toastify'
import ConnectWalletButton from '@/components/Button/ConnectWalletButton'

export default function ProfileModal({ show, onClose }: ModalProps) {
  const address = useAuthStore(state => state.profile?.publicKey)
  const { data: tokenBalance } = useBalance({
    address,
    token: tokens.wu2u.address
  })

  const username = useAuthStore(state => state.profile?.username)
  const userId = useAuthStore(state => state.profile?.id)
  const { onLogout } = useAuth()

  const { txStatus, updateHash } = useTransactionStatus()
  const { writeAsync } = useContractWrite({
    ...tokens.wu2u,
    abi: WETH_ABI,
    functionName: 'withdraw'
  })

  const handleClaimToken = async () => {
    if (!!tokenBalance && tokenBalance?.value <= BigInt(0)) {
      return
    }
    try {
      const { hash } = await writeAsync({ args: [tokenBalance?.value] })
      updateHash(hash)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (txStatus.isSuccess) {
      toast.success('Token balance has been successfully withdraw to your wallet', { autoClose: 5000 })
    }
  }, [txStatus.isSuccess]);

  return (
    <Modal dismissible onClose={onClose} position="top-right" show={show} size="sm">
      <Modal.Body>
        <div className="flex justify-between items-center py-4">
          <div className="flex gap-3 items-center">
            <Image
              src={defaultAvatar}
              alt="Avatar"
              width={48}
              height={48}
            />
            <Link href={`/user/${userId}`} className="flex flex-col" onClick={onClose}>
              <Text className="text-primary font-semibold" variant="body-18">{username}</Text>
              <Text className="text-secondary">View profile</Text>
            </Link>
          </div>
          <Button variant="icon" onClick={onClose}>
            <Icon name="arrowRight" width={20} height={20} />
          </Button>
        </div>

        <ConnectWalletButton className="w-full p-4 my-5 bg-info/20 cursor-pointer border-[0.5px] rounded-2xl border-tertiary">
          <div className="p-4 my-5 bg-info/20 cursor-pointer border-[0.5px] rounded-2xl border-tertiary"
               onClick={handleClaimToken}>
            <div className="flex items-center justify-between">
              <Text className="font-semibold text-secondary">Market trade profits: </Text>
              <Text className="font-bold text-primary">{tokenBalance?.formatted || '0'} U2U</Text>
            </div>
            <Button loading={txStatus.isLoading} className="w-full" variant="text">Claim</Button>
          </div>
        </ConnectWalletButton>

        <div className="py-4">
          <Link className="text-secondary hover:text-primary" href={"/explore/items"} onClick={onClose}>
            Explore
          </Link>
        </div>
        <div className="py-4">
          <Link className="text-secondary hover:text-primary" href={"/create/collection"} onClick={onClose}>
            Create Collection
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
          <Link href="#" onClick={() => {
            onLogout()
            onClose?.()
          }}>
            Logout
          </Link>
        </div>
      </Modal.Body>
    </Modal>
  )
}
