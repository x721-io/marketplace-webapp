import { Table } from 'flowbite-react'
import React, { useMemo, useState } from 'react'
import { findTokenByAddress } from '@/utils/token'
import { formatUnits } from 'ethers'
import { format } from 'date-fns'
import { useNFTMarketStatus } from '@/hooks/useMarket'
import Button from '@/components/Button'
import AcceptBidNFTModal from '@/components/Modal/AcceptBidNFTModal'
import Text from '@/components/Text'
import { formatThousandDelimiter } from '@/utils'
import { NFT, MarketEvent } from '@/types'
import { APIResponse } from '@/services/api/types'

export default function BidsTab({ nft, marketData }: { nft: NFT, marketData?: APIResponse.NFTMarketData }) {
  const type = nft.collection.type
  const { isOwner } = useNFTMarketStatus(type, marketData)
  const [showAcceptBid, setShowAcceptBid] = useState(false)
  const [selectedBid, setSelectedBid] = useState<MarketEvent>()

  const handleAcceptBid = (bid: MarketEvent) => {
    setSelectedBid(bid)
    setShowAcceptBid(true)
  }

  return (
    <div className="py-7 overflow-x-auto">
      {(!marketData || !marketData.bidInfo.length) ? (
        <div className="w-full flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
          <Text className="text-secondary font-semibold text-body-18">Nothing to show</Text>
        </div>
      ) : (
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
              Array.isArray(marketData.bidInfo) && (
                marketData.bidInfo.map(row => {
                  const token = findTokenByAddress(row.quoteToken)
                  return (
                    <Table.Row key={row.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {row.to}
                      </Table.Cell>
                      <Table.Cell>{formatThousandDelimiter(formatUnits(row.price, token?.decimal))}</Table.Cell>
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
      )}

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