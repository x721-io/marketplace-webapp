"use client"

import Button, { ButtonProps } from './index'
import { useState } from 'react'
import SignupModal from '@/components/Modal/SignupModal'
import WalletConnectModal from '@/components/Modal/WalletConnectModal'
import { useAccount } from 'wagmi'
import SignConnectMessageModal from '@/components/Modal/SignConnectMessageModal'

export default function ConnectWalletButton({ children, ...rest }: ButtonProps & { children?: React.ReactNode }) {
  const { isConnected } = useAccount()
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  const [showSignMessage, setShowSignMessage] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const handleConnectWallet = () => {
    setShowWalletConnect(true)
  }

  if (isConnected) {
    return children
  }

  return (
    <>
      <Button {...rest} onClick={handleConnectWallet}>
        Connect Wallet
      </Button>

      <WalletConnectModal
        show={showWalletConnect}
        onSignMessage={() => setShowSignMessage(true)}
        onClose={() => setShowWalletConnect(false)} />

      <SignConnectMessageModal
        show={showSignMessage}
        onSignup={() => setShowSignup(true)}
        onClose={() => setShowSignMessage(false)} />

      <SignupModal
        show={showSignup}
        onClose={() => setShowSignup(false)} />
    </>
  )
}