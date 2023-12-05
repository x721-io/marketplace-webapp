import {
  CustomFlowbiteTheme,
  Modal,
  ModalProps
} from 'flowbite-react'
import { navs } from '@/config/nav'
import Link from 'next/link'
import Icon from '@/components/Icon'
import Button from '@/components/Button'
import Text from '@/components/Text'
import Collapsible from '@/components/Collapsible'
import ConnectWalletButton from '@/components/Button/ConnectWalletButton'
import { useAuth } from '@/hooks/useAuth'
import useAuthStore from '@/store/auth/store'
import { useBalance } from 'wagmi'
import { useState } from 'react'
import MobileMenuAccountInformation from '@/components/Modal/MobileMenuModal/AccountInformation'

const modalTheme: CustomFlowbiteTheme['modal'] = {
  root: {
    sizes: {
      "7xl": "max-w-7xl !p-0"
    }
  },
  content: {
    inner: 'relative bg-white flex flex-col h-screen'
  },
  body: {
    base: "p-0 flex-1 overflow-auto"
  }
}

export default function MobileMenuModal({ onClose, show }: ModalProps) {
  const { isLoggedIn } = useAuth()
  const address = useAuthStore(state => state.profile?.publicKey)
  const { data: balance } = useBalance({
    address
  })

  const [showAccount, setShowAccount] = useState(false)

  return (
    <Modal dismissible onClose={onClose} show={show} size="7xl" theme={modalTheme}>
      <Modal.Body className="flex flex-col gap-4  ">
        {showAccount ? (
          <MobileMenuAccountInformation
            balance={parseFloat(balance?.formatted || '0').toFixed(2)}
            onClose={onClose}
            onBack={() => setShowAccount(false)} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <Link href="/" onClick={onClose}>
                  <Icon name="u2u-logo-mobile" width={28} height={28} />
                </Link>
                <button onClick={onClose}>
                  <Icon className="text-secondary" name="search" width={24} height={24} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <Button className="w-12 !min-w-0 !p-2" variant="icon" disabled>
                  <Icon name="shoppingBag" width={16} height={16} />
                </Button>
                <button onClick={onClose}>
                  <Icon name="close" width={24} height={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {isLoggedIn && (
                <div className="flex items-center justify-between" onClick={() => setShowAccount(true)}>
                  <Text className="text-secondary font-semibold" variant="body-18">
                    Account
                  </Text>
                  <div className="flex items-center gap-4">
                    <Text className="font-semibold text-secondary">
                  <span className="text-primary">
                    {parseFloat(balance?.formatted || '0').toFixed(2)}
                  </span> U2U
                    </Text>
                    <div className="rounded-lg p-1 bg-surface-medium text-secondary">
                      <Icon name="arrowRight" width={16} height={16} />
                    </div>
                  </div>
                </div>
              )}
              {navs.map(nav => {
                if (nav.items?.length) {
                  return (
                    <Collapsible
                      key={nav.label}
                      className="!p-0"
                      header={(
                        <Text className="text-primary font-semibold" variant="body-18">{nav.label}</Text>
                      )}>
                      <div className="flex flex-col gap-2 px-2">
                        {nav.items.map(item => (
                          <Link
                            className="text-secondary font-semibold text-body-16"
                            onClick={onClose}
                            href={item.href}
                            key={item.label}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </Collapsible>
                  )
                }

                return (
                  <Link
                    key={nav.label}
                    className="text-secondary font-semibold text-body-18"
                    onClick={onClose}
                    href={nav.href}>
                    {nav.label}
                  </Link>
                )
              })}
            </div>

            <ConnectWalletButton />
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}