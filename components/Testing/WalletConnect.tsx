'use client'

import Button from '@/components/Button'
import React from 'react'
import { useConnect } from 'wagmi'

export default function TestWalletConnect() {
  const { connect, connectors, error: walletError, isLoading, pendingConnector } = useConnect()

  return (
    <div>
      <div className="inline-flex gap-4">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {isLoading &&
              pendingConnector?.id === connector.id &&
              ' (connecting)'}
          </Button>
        ))}
      </div>
      {walletError && <div>{walletError.message}</div>}
    </div>
  )
}