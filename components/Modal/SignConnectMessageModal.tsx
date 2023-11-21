import { Modal, ModalProps, Spinner } from 'flowbite-react'
import Text from '@/components/Text'
import Button from '@/components/Button'
import { useAccount, useSignMessage } from 'wagmi'
import { SIGN_MESSAGE } from '@/config/constants'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/auth/store'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'

interface Props extends ModalProps {
  onSignup: () => void
}

export default function SignConnectMessageModal({ show, onClose, onSignup }: Props) {
  const api = useMarketplaceApi()
  const router = useRouter()
  const { address } = useAccount()
  const { isError, isLoading, signMessageAsync, error } = useSignMessage()
  const { setProfile } = useAuthStore()
  const { onAuth } = useAuth()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState('')

  const handleSignMessage = async () => {
    setAuthError('')

    if (!address) return
    const date = new Date().toISOString()

    try {
      const signature = await signMessageAsync({ message: SIGN_MESSAGE.CONNECT(date) })
      setIsAuthenticating(true)
      await onAuth(date, signature)
      const profile= await api.viewProfile(address)
      if (!profile.acceptedTerms) { // Not registered
        onSignup()
      } else {
        setProfile(profile)
        // todo: Fix
        router.back()
      }

      setIsAuthenticating(false)
    } catch (e: any) {
      setAuthError(e.message)
      setIsAuthenticating(false)
      console.error('Error signing connect message:', e)
    }
  }

  const renderContent = () => {
    switch (true) {
      case isLoading:
        return (
          <>
            <Text className="font-semibold text-primary text-center text-heading-sm">
              Loading...
            </Text>
            <Text className="text-secondary text-center" variant="body-18">
              Sign the message in your wallet MetaMask to sign in safely
            </Text>
            <Spinner size="xl" />
            <Button className="w-full" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </>
        )
      case isAuthenticating:
        return (
          <>
            <Text className="font-semibold text-primary text-center text-heading-sm">
              Authenticating...
            </Text>
            <Text className="text-secondary text-center" variant="body-18">
              Connecting your wallet to U2U NFT Market
            </Text>
            <Spinner size="xl" />
          </>
        )
      case isError || !!authError:
        return (
          <>
            <Text className="font-semibold text-error text-center text-heading-sm">
              Error report
            </Text>
            <Text className="max-w-full text-secondary text-center text-ellipsis" variant="body-18">
              {error?.message || authError}
            </Text>

            <div>
              <Button className="w-full mb-5" variant="primary" onClick={handleSignMessage}>
                Try again
              </Button>
              <Button className="w-full" variant="secondary" onClick={onClose}>
                Close and Continue
              </Button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    if (show) {
      handleSignMessage()
    } else {
      setAuthError('')
    }
  }, [show])

  return (
    <Modal dismissible show={show} onClose={onClose} size="md">
      <Modal.Body>
        <div className="mx-auto flex flex-col gap-8 p-8 items-center overflow-ellipsis">
          {renderContent()}
        </div>
      </Modal.Body>
    </Modal>
  )
}