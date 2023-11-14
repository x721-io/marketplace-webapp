"use client"

import { useAccount, useConnect } from "wagmi";
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/Button'
import Text from '@/components/Text'
import Select from '@/components/Form/Select'
import React, { useState } from 'react'
import Input from '@/components/Form/Input'

const Icon = () => (
  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400"
       aria-hidden="true"
       xmlns="http://www.w3.org/2000/svg"
       fill="currentColor"
       viewBox="0 0 20 20">
    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
  </svg>
)
export default function Home() {
  const { connector: activeConnector, isConnected } = useAccount()
  const { onConnect } = useAuth()
  const { connectors, error, isLoading, pendingConnector } = useConnect()

  const [text, setText] = useState('')
  const [selected, setSelected] = useState('1')
  const options = [{ label: 'value 1', value: 1 }, { label: 'value 2', value: 2 }]

  return (
    <div className="p-11 flex flex-col gap-2">
      <div>
        <Input
          error
          value={text}
          onChange={event => setText(event.target.value)}
        />

      </div>

      <Select options={options} value={selected} onChange={e => {
        setSelected(e.target.value)
      }} />

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
