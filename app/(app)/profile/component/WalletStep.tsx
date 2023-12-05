"use client"
import Text from '@/components/Text';
import React from 'react';
import Image from 'next/image'
import u2uWalletSvg from '@/assets/u2uWallet.svg'
import cryptoSvg from '@/assets/crypto.svg'

export default function WalletStep() {
  return (
    <div className="flex gap-8 mb-8 flex-col">
      <Text className="text-body-24 tablet:text-body-32 desktop:text-body font-semibold desktop:mt-5 mt-7">Manage
        Wallet</Text>
      <div className="flex gap-3 w-full flex-col">
        <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
          <div className="flex">
            <Image width={40} height={40} src={u2uWalletSvg} alt="u2u-brand" className="rounded-full mr-3" />
            <div className="flex flex-col gap-1">
              <Text className="text-body-16 text-primary">Wallet3290</Text>
              <div className="bg-white rounded-lg text-center">
                <Text className="text-body-12 text-secondary">U2U Chain</Text>
              </div>
            </div>
          </div>
          {/* <button className='w-12 h-12 bg-white rounded-xl p-3'>
                     <MoreHorizontalIcon />
                     </button> */}
        </div>
      </div>
      <div className="flex gap-3 w-full flex-col">
        <div className="bg-surface-soft p-3 rounded-xl flex justify-between items-center">
          <div className="flex">
            <Image width={40} height={40} src={cryptoSvg} alt="u2u-brand" className="rounded-full mr-3" />
            <div className="flex flex-col gap-1">
              <Text className="text-body-16 text-primary">Wallet3290</Text>
              <div className="bg-white rounded-lg text-center">
                <Text className="text-body-12 text-secondary">Ethereum</Text>
              </div>
            </div>
          </div>
          {/* <button className='w-12 h-12 bg-white rounded-xl p-3'>
                     <MoreHorizontalIcon />
                     </button> */}
        </div>
      </div>
      {/* <div className='w-full tablet:w-auto desktop:w-auto'>
                 <Button className="w-full tablet:w-auto desktop:w-auto">Link wallet</Button>
                 </div> */}
    </div>
  )
}