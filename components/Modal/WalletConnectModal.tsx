import { Modal, ModalProps, Spinner } from 'flowbite-react'
import Text from '@/components/Text'
import Icon from '@/components/Icon'
import { Connector, useAccount, useConnect } from 'wagmi'
import { sleep } from '@/utils'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

interface Props extends ModalProps {
  onSignMessage: () => void
}

export default function WalletConnectModal({ show, onClose, onSignMessage }: Props) {
  const { onLogout } = useAuth()
  const { isConnected } = useAccount()
  const { connect, connectors, pendingConnector, isLoading } = useConnect()

  const handleConnect = async (connector: Connector) => {
    try {
      onLogout()
      if (!isConnected) {
        connect({ connector })
      }

    } catch (e) {
      console.error('Error connecting wallet:', e)
    }
  }

  useEffect(() => {
    if (isConnected) {
      onSignMessage()
      onClose && onClose()
    }
  }, [isConnected]);

  return (
    <Modal dismissible show={show} onClose={onClose} size="lg">
      <Modal.Body>
        <div className="mx-auto flex flex-col gap-8 p-8 items-center overflow-ellipsis">
          <Text className="text-heading-md text-primary font-semibold text-center">
            Connect wallet
          </Text>
          <Text className="text-body-18 text-secondary text-center">
            Choose a wallet you want to connect. There are several wallet providers.
          </Text>

          <div className="w-full flex flex-col gap-5">
            {
              connectors.map(connector => {
                return (
                  <div
                    key={connector.id}
                    className="cursor-pointer px-10 py-4 border border-gray-200 rounded-[20px]
                      flex items-center gap-5 transition-all hover:bg-gray-100 hover:border-transparent"
                    onClick={() => handleConnect(connector)}>
                    {connector.ready ? <Icon name={connector.id} width={40} height={40} /> : <Spinner size="xl" />}
                    <Text>
                      {connector.name}
                    </Text>
                    {isLoading && pendingConnector?.id === connector.id && <Spinner size="xl" />}
                  </div>
                )
              })
            }
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}