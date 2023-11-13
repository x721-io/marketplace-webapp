"use client"

import { useAccount, useConnect } from "wagmi";
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/Button'

export default function Home() {
  const { connector: activeConnector, isConnected } = useAccount()
  const { onConnect } = useAuth()
  const { connectors, error, isLoading, pendingConnector } = useConnect()

  return (
    <>
      {isConnected && <div>Connected to {activeConnector?.name}</div>}
      <Button variant="secondary">
        disabled
      </Button>
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          onClick={() => onConnect(connector)}
        >
          {connector.name}
          {isLoading &&
            pendingConnector?.id === connector.id &&
            ' (connecting)'}
        </Button>

      ))}

      {error && <div>{error.message}</div>}
    </>
  )
}
