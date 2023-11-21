'use client'

import Button from '@/components/Button'
import React from 'react'
import { contracts } from '@/config/contracts'
import { useAccount, useContractWrite } from 'wagmi'

export default function Mint721NFT() {
  const { address } = useAccount()
  const args = [
    {
      tokenId: address + "000000000000000000001028",
      tokenURI: "uri:/",
      creators: [{ account: address, value: 10000 }],
      royalties: [],
      signatures: ["0x"]
    },
    address
  ]

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    ...contracts.erc721,
    functionName: 'mintAndTransfer',
    args: args
  })

  return (
    <div className="border p-6 m-6">
      Mint 721 NFT
      <Button onClick={() => {
        write()
      }}>
        Mint NFT
      </Button>
      <div className="border p-6">
        Data: {data ? JSON.stringify(data) : ''}
        <br />
        Error: {error?.message}
      </div>
    </div>
  )
}