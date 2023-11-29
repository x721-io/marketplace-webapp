"use client"

import { useNetwork, useSwitchNetwork } from 'wagmi'
import { useEffect } from 'react'
import { CHAIN_ID } from '@/config/constants'
import MainHeader from '@/components/Layout/MainHeader'
import MainFooter from '@/components/Layout/MainFooter'
import { toast } from 'react-toastify'
import Button from '@/components/Button'

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
    <main className="flex flex-col min-h-screen">
      <MainHeader />
      <div className="flex-1">
        {children}
      </div>
      <MainFooter />
    </main>
  )
};