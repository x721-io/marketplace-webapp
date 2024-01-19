import { NFT, Royalty } from '@/types'
import { useMemo } from 'react'
import { formatUnits } from 'ethers'
import { useReadNFTRoyalties } from '@/hooks/useRoyalties'
import { Address, useContractReads } from 'wagmi'
import { findTokenByAddress } from '@/utils/token'
import Image from 'next/image'
import { formatDisplayedBalance } from '@/utils'
import { contracts } from '@/config/contracts'
import Text from '../Text'

interface Props {
  mode: 'buyer' | 'seller'
  price?: bigint
  nft: NFT
  quoteToken?: Address
}

export default function FeeCalculator({ price = BigInt(0), nft, mode, quoteToken }: Props) {
  const token = useMemo(() => findTokenByAddress(quoteToken), [quoteToken])
  const feeDistributorContract = contracts.feeDistributorContract

  const { data } = useContractReads({
    contracts: [
      {
        ...feeDistributorContract,
        functionName: 'calculateFee',
        args: [price || BigInt(0), nft.collection.address, (nft.u2uId || nft.id) as any]
      },
      {
        ...feeDistributorContract,
        functionName: 'protocolFeePercent'
      },
      {
        ...feeDistributorContract,
        functionName: 'feeRatioSellerBuyer'
      }
    ],
    select: (data) => data.map(item => item.result)
  })

  const [sellerFee, buyerFee, royaltiesFee, netReceived] = useMemo(() => {
    return (data && Array.isArray(data[0])) ? data[0] : [BigInt(0), BigInt(0), BigInt(0), BigInt(0)]
  }, [data])

  const feeRatio = useMemo(() => {
    const ratio = data ? data[2] : BigInt(0)
    const protocolFeePercent = data ? data[1] : BigInt(0)

    const sellerFeeRatio = Number(ratio) / 100
    const buyerFeeRatio = 100 - Number(ratio) / 100
    const sellerFeePercent = (sellerFeeRatio * Number(protocolFeePercent)) / 10000
    const buyerFeePercent = (buyerFeeRatio * Number(protocolFeePercent)) / 10000

    return { seller: sellerFeePercent, buyer: buyerFeePercent }
  }, [data])

  const { data: royalties } = useReadNFTRoyalties(nft)

  const totalRoyalties = useMemo(() => {
    if (!royalties?.length) return 0

    const totalRoyaltiesValue = royalties.reduce((accumulator: bigint, current: Royalty) => BigInt(current.value) + BigInt(accumulator), BigInt(0))
    return Number(totalRoyaltiesValue) / 100
  }, [royalties])

  return (
    <div className="w-full p-4 border border-disabled rounded-2xl flex flex-col gap-3">
      {mode === 'seller' ? (
        <>
          <div className="w-full flex items-center justify-between">
            <p className="text-secondary">Origin fee (Seller): {feeRatio.seller}%</p>
            <div className="flex items-center font-bold gap-1">
              <Text showTooltip labelTooltip={formatDisplayedBalance(formatUnits(sellerFee, 18))} className="w-auto max-w-[80px]" >
                {formatDisplayedBalance(formatUnits(sellerFee, 18))}
              </Text>
              <p className="text-secondary">{token?.symbol}</p>
              {!!token?.logo &&
                <Image className="w-5 h-5 rounded-full" src={token?.logo || ''} alt="" width={40} height={40} />}
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <p className="text-secondary">Royalties fee ({totalRoyalties}%):</p>
            <div className="flex items-center font-bold gap-1">
            <Text showTooltip labelTooltip={formatDisplayedBalance(formatUnits(sellerFee, 18))} className="w-auto max-w-[80px]" >
              {formatDisplayedBalance(formatUnits(royaltiesFee, 18))}
            </Text>
              <p className="text-secondary">{token?.symbol}</p>
              {!!token?.logo &&
                <Image className="w-5 h-5 rounded-full" src={token?.logo || ''} alt="" width={40} height={40} />}
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <p className="text-secondary font-bold">You will get:</p>
            <div className="flex items-center font-bold gap-1">
              <Text showTooltip labelTooltip={formatDisplayedBalance(formatUnits(sellerFee, 18))} className="w-auto max-w-[80px]" >
                {formatDisplayedBalance(formatUnits(netReceived, token?.decimal))}
              </Text>
              <p className="text-secondary">{token?.symbol}</p>
              {!!token?.logo &&
                <Image className="w-5 h-5 rounded-full" src={token?.logo || ''} alt="" width={40} height={40} />}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full flex items-center justify-between">
            <p className="text-secondary">Origin fee (Buyer): {feeRatio.buyer}%</p>
            <div className="flex items-center font-bold gap-1">
              <Text showTooltip labelTooltip={formatDisplayedBalance(formatUnits(buyerFee, 18))} className="w-auto max-w-[80px]" >
                {formatDisplayedBalance(formatUnits(buyerFee, 18))}
              </Text>
              <p className="text-secondary">{token?.symbol}</p>
              {!!token?.logo &&
                <Image className="w-5 h-5 rounded-full" src={token?.logo || ''} alt="" width={40} height={40} />}
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <p className="text-secondary font-bold">You will pay:</p>
            <div className="flex items-center font-bold gap-1">
              <Text showTooltip labelTooltip={formatDisplayedBalance(formatUnits(price + buyerFee, 18))} className="w-auto max-w-[80px]" >
                {formatDisplayedBalance(formatUnits(price + buyerFee, 18))}
              </Text>
              <p className="text-secondary">{token?.symbol}</p>
              {!!token?.logo &&
                <Image className="w-5 h-5 rounded-full" src={token?.logo || ''} alt="" width={40} height={40} />}
            </div>
          </div>
        </>
      )}
    </div>
  )
}