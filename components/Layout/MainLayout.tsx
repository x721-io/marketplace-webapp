"use client"

import { useNetwork } from 'wagmi'
import { useEffect } from 'react'
import { CHAIN_ID } from '@/config/constants'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork()

  useEffect(() => {
    if (chain?.id && chain?.id !== CHAIN_ID) {
      alert('Wrong network detected!')
    }
  }, [chain])

  return (
    <main className="bg-primary">
      {children}
    </main>
  )
};