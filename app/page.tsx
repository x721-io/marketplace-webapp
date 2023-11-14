"use client"

import { useAccount, useConnect } from "wagmi";
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/Button'
import Text from '@/components/Text'
import Select from '@/components/Form/Select'
import React, { useState } from 'react'
import Input from '@/components/Form/Input'
import Icon from '@/components/Icon'

export default function Home() {
  const { connector: activeConnector, isConnected } = useAccount()
  const { onConnect } = useAuth()
  const { connectors, error, isLoading, pendingConnector } = useConnect()

  const [text, setText] = useState('')
  const [selected, setSelected] = useState('1')
  const options = [{ label: 'value 1', value: 1 }, { label: 'value 2', value: 2 }]

  return (
    <div className="p-11 ">
      <div>
        <Input
          error
          value={text}
          onChange={event => setText(event.target.value)}
        />

      </div>

      <Select
        options={options}
        value={selected}
        onChange={e => setSelected(e.target.value)}
        prependIcon={<Icon name="u2u-logo" />}
      />

      {isConnected && <div>Connected to {activeConnector?.name}</div>}
      <Text className="font-bold text-white" variant="body-14">
        disabled
      </Text>


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
    </div>
  )
}
