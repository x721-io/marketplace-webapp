import Mint721NFT from '@/components/Testing/Mint721NFT'
import Mint721Collection from '@/components/Testing/Mint721Collection'
import Mint1155Collection from '@/components/Testing/Mint1155Collection'
import Mint1155NFT from '@/components/Testing/Mint1155NFT'
import TestWalletConnect from '@/components/Testing/WalletConnect'

export default function() {

  return (
    <div className="p-10">
      <TestWalletConnect />
      <Mint721Collection />
      <Mint721NFT />
      <Mint1155Collection />
      <Mint1155NFT />
    </div>
  )
}