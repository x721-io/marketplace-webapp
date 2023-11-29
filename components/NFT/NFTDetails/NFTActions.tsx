import Button from '@/components/Button'
import Icon from '@/components/Icon'
import { APIResponse } from '@/services/api/types'
import { useNFTMarketStatus } from '@/hooks/useMarket'
import { useMemo, useState } from 'react'
import ConnectWalletButton from '@/components/Button/ConnectWalletButton'
import SellNFTModal from '@/components/Modal/SellNFTModal'
import BuyNFTModal from '@/components/Modal/BuyNFTModal'
import BidNFTModal from '@/components/Modal/BidNFTModal'
import CancelSellNFTModal from '@/components/Modal/CancelSellNFTModal'
import CancelBidNFTModal from '@/components/Modal/CancelBidNFTModal'
import useAuthStore from '@/store/auth/store'

export default function NFTActions(nft: APIResponse.NFT) {
  const wallet = useAuthStore(state => state.profile?.publicKey)
  const { isOwner, isOnSale } = useNFTMarketStatus(nft)
  const myBid = useMemo(() => {
    return nft.bidInfo?.find(bid => bid.to === wallet?.toLowerCase())
  }, [nft.bidInfo])
  const [showSellModal, setShowSellModal] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showBidModal, setShowBidModal] = useState(false)
  const [showCancelSellModal, setShowCancelSellModal] = useState(false)
  const [showCancelBidModal, setShowCancelBidModal] = useState(false)

  if (isOwner) {
    return (
      <ConnectWalletButton className="w-full">
        {
          isOnSale ? (
            <Button className="w-full" onClick={() => setShowCancelSellModal(true)}>
              Cancel listing
            </Button>
          ) : (
            <Button className="w-full" onClick={() => setShowSellModal(true)}>
              Put on sale
            </Button>
          )
        }
        <SellNFTModal nft={nft} show={showSellModal} onClose={() => setShowSellModal(false)} />
        <CancelSellNFTModal nft={nft} show={showCancelSellModal} onClose={() => setShowCancelSellModal(false)} />
      </ConnectWalletButton>
    )
  }

  return (
    <ConnectWalletButton className="w-full">
      {
        isOnSale ? (
          <div className="flex items-center gap-3 mb-3">
            <Button className="flex-1" onClick={() => setShowBuyModal(true)}>
              Buy Now
            </Button>
            <Button className="w-12 !min-w-0 !p-2" disabled>
              <Icon name="shoppingBag" width={16} height={16} />
            </Button>
          </div>
        ) : !!myBid ? (
          <Button className="w-full" variant="outlined" onClick={() => setShowCancelBidModal(true)}>
            Cancel bidding
          </Button>
        ) : (
          <Button className="w-full" variant="outlined" onClick={() => setShowBidModal(true)}>
            Place a bid
          </Button>
        )
      }

      <BuyNFTModal nft={nft} show={showBuyModal} onClose={() => setShowBuyModal(false)} />
      <BidNFTModal nft={nft} show={showBidModal} onClose={() => setShowBidModal(false)} />
      <CancelBidNFTModal bid={myBid} nft={nft} show={showCancelBidModal} onClose={() => setShowCancelBidModal(false)} />
    </ConnectWalletButton>
  )
}