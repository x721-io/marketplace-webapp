"use client"

import { useState } from 'react'
import { Connector, useAccount, useConnect } from 'wagmi'
import Text from '@/components/Text'
import Icon from '@/components/Icon'
import SignConnectMessageModal from '@/components/Modal/SignConnectMessageModal'
import SignupModal from '@/components/Modal/SignupModal'
import { sleep } from '@/utils'

export default function ConnectPage() {
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()
  const [showSignMessage, setShowSignMessage] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const handleConnect = async (connector: Connector) => {
    try {
      if (!isConnected) {
        connect({ connector })
      }
      await sleep(100)
      setShowSignMessage(true)
    } catch (e) {
      console.error('Error connecting wallet:', e)
    }
  }

  return (
    <main className="flex items-center justify-center">
      <div className="px-20 py-40">
        <Text className="text-heading-md text-primary font-semibold mb-5">
          Connect wallet
        </Text>
        <Text className="text-body-18 text-secondary mb-10">
          Choose a wallet you want to connect. There are several wallet providers.
        </Text>

        <div className="flex flex-col gap-5">
          {
            connectors.map(connector => {
              if (!connector.ready) return null

              return (
                <div
                  key={connector.id}
                  className="cursor-pointer px-6 py-4 border border-gray-200 rounded-[20px]
                  flex items-center gap-5 transition-all hover:bg-gray-100 hover:border-none"
                  onClick={() => handleConnect(connector)}
                >
                  <Icon name={connector.id} width={40} height={40} />
                  <Text>
                    {connector.name}
                  </Text>
                </div>
              )
            })
          }
        </div>
      </div>
      <SignConnectMessageModal
        onSignup={() => setShowSignup(true)}
        show={showSignMessage}
        onClose={() => setShowSignMessage(false)} />
      <SignupModal
        show={showSignup}
        onClose={() => setShowSignup(false)} />
    </main>
  )
}