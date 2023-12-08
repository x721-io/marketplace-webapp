import { useEffect } from 'react'
import { CHAIN_ID } from '@/config/constants'
import { toast } from 'react-toastify'
import Button from '@/components/Button'
import { useNetwork, useSwitchNetwork } from 'wagmi'

export default function MainBody({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    if (chain?.id && chain?.id !== CHAIN_ID) {
      toast.warning('Wrong network detected', {
        position: 'bottom-center',
        autoClose: false,
        closeButton: ({ closeToast }) => (
          <Button
            className="text-body-16 font-semibold text-info"
            variant="text"
            onClick={(e) => {
              closeToast(e)
              switchNetwork?.(CHAIN_ID)
            }}
          >Change network</Button>
        )
      })
    }
  }, [chain])

  return (
    <div className="flex-1">
      {children}
    </div>
  )
}