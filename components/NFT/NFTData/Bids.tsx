import { Table } from 'flowbite-react'
import { APIResponse, MarketEvent } from '@/services/api/types'
import { useMemo, useState } from 'react'
import { findTokenByAddress } from '@/utils/token'
import { formatUnits } from 'ethers'
import { format } from 'date-fns'
import { useNFTMarketStatus } from '@/hooks/useMarket'
import Button from '@/components/Button'
import AcceptBidNFTModal from '@/components/Modal/AcceptBidNFTModal'

export default function BidsTab({ nft }: { nft: APIResponse.NFT }) {
  const { isOwner } = useNFTMarketStatus(nft)
  const type = nft.collection.type
  const bids = useMemo(() => nft.bidInfo, [nft.bidInfo])
  const [showAcceptBid, setShowAcceptBid] = useState(false)
  const [selectedBid, setSelectedBid] = useState<MarketEvent>()

  const handleAcceptBid = (bid: MarketEvent) => {
    setSelectedBid(bid)
    setShowAcceptBid(true)
  }

  return (
    <div className="py-7 overflow-x-auto">
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Bidder</Table.HeadCell>
          <Table.HeadCell>
            {type === 'ERC721' ? 'Price' : 'Price per unit'}
          </Table.HeadCell>
          {type === 'ERC1155' && (<Table.HeadCell>Amount</Table.HeadCell>)}
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Action</span>
          </Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {
            Array.isArray(bids) && (
              bids.map(row => {
                const token = findTokenByAddress(row.quoteToken)
                return (
                  <Table.Row key={row.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {row.to}
                    </Table.Cell>
                    <Table.Cell>{formatUnits(row.price, token?.decimal)}</Table.Cell>
                    {type === 'ERC1155' && (<Table.Cell>{row.amounts}</Table.Cell>)}
                    <Table.Cell>{format(Number(row.timestamp) * 1000, 'yyyy-MM-dd HH:mm:ss')}</Table.Cell>
                    <Table.Cell>
                      {isOwner ? <Button onClick={() => handleAcceptBid(row)} variant="text">Accept</Button> : '-'}
                    </Table.Cell>
                  </Table.Row>
                )
              })
            )
          }
        </Table.Body>
      </Table>

      <AcceptBidNFTModal
        nft={nft}
        bid={selectedBid}
        show={showAcceptBid}
        onClose={() => {
          setSelectedBid(undefined)
          setShowAcceptBid(false)
        }} />
    </div>
  )
}