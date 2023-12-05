import Text from '@/components/Text'
import Icon from '@/components/Icon'
import Image from 'next/image'
import defaultAvatar from '@/assets/images/default-avatar.png'
import Link from 'next/link'
import useAuthStore from '@/store/auth/store'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  onBack: () => void,
  balance: string,
  onClose?: () => void
}

export default function MobileMenuAccountInformation({ onBack, balance, onClose }: Props) {
  const userId = useAuthStore(state => state.profile?.id)
  const username = useAuthStore(state => state.profile?.username)
  const { onLogout } = useAuth()

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between" onClick={onBack}>
        <div className="flex items-center gap-4">
          <div className="rounded-lg p-1 bg-surface-medium text-secondary">
            <Icon name="arrowLeft" width={16} height={16} />
          </div>
          <Text className="text-secondary font-semibold" variant="body-18">
            Account
          </Text>
        </div>

        <Text className="font-semibold text-secondary">
          <span className="text-primary">
            {balance}
          </span> U2U
        </Text>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
        </div>
      </div>

      <Link className="text-secondary hover:text-primary" href={"/explore/items"} onClick={onClose}>
        Explore
      </Link>
      <Link className="text-secondary hover:text-primary" href={"/create/collection"} onClick={onClose}>
        Create Collection
      </Link>
      <Link className="text-secondary hover:text-primary" href={"/create/nft"} onClick={onClose}>
        Create NFT
      </Link>
      <div className="border-b" />
      <Link className="text-secondary hover:text-primary" href={"/profile"} onClick={onClose}>
        Settings
      </Link>
      <Link href="#" onClick={() => {
        onLogout()
        onClose?.()
        onBack()
      }}>
        Logout
      </Link>
    </div>
  )
}