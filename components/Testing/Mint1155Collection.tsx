'use client'

import Button from '@/components/Button'
import React from 'react'
import { useContractRead, useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import { randomWord } from '@rarible/types'

export default function Mint1155Collection() {
  const salt = randomWord()
  const args = [
    'ERC1155',
    'ERC1155',
    'ipfs:/',
    'contract',
    [],
    salt
  ]

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    ...contracts.erc1155Factory,
    functionName: 'createToken',
    args: args
  })

  const { data: viewResponse, error: viewError } = useContractRead({
    ...contracts.erc1155Factory,
    functionName: 'getAddress',
    args: [
      'ERC1155',
      'ERC1155',
      'ipfs:/',
      'contract',
      [],
      '0x3dbe840da42fd72915c8aaf8b2eccd591e09e957890ee35477dce04ca213d650'
    ]
  })

  return (
    <div className="border p-6 m-6">
      Mint 1155 Collection
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