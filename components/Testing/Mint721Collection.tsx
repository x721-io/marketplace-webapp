'use client'

import Button from '@/components/Button'
import React from 'react'
import { useContractRead, useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import { randomWord } from '@rarible/types'

export default function Mint721Collection() {
  const salt = randomWord()
  const args = [
    'thalos',
    'TvT',
    'ipfs:/',
    'contract',
    [],
    salt
  ]

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    ...contracts.erc721Factory,
    functionName: 'createToken',
    args: args
  })

  const { data: viewResponse, error: viewError } = useContractRead({
    ...contracts.erc721Factory,
    functionName: 'getAddress',
    args: [
      'thalos',
      'TvT',
      'ipfs:/',
      'contract',
      [],
      salt
    ]
  })

  return (
    <div className="border p-6 m-6">
      Mint 721 Collection
      <Button onClick={() => {
        console.log('salt', salt)
        write()
      }}>
        Create Collection
      </Button>

      <div className="border p-6">
        Data: {data ? JSON.stringify(data) : ''}
        <br />
        Error: {error?.message}
      </div>

      <div className="border p-6">
        Contract address: {viewResponse ? JSON.stringify(viewResponse) : ''}
        <br />
        View Error: {error?.message}
      </div>
    </div>
  )
}