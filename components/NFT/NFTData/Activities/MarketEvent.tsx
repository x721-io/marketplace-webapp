import defaultAvatar from "@/assets/images/default-avatar.png";
import { MarketEvent } from '@/types'
import { classNames, getUserLink, shortenAddress } from '@/utils/string'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { formatUnits } from 'ethers'
import { formatDisplayedBalance } from '@/utils'
import { findTokenByAddress } from '@/utils/token'

interface MarketEventProps extends React.HTMLAttributes<HTMLDivElement> {
  event: MarketEvent
}

interface RowProps {
  children: React.ReactNode
  maker: MarketEvent['to' | 'from']
  timestamp: number
}

const Row = ({ children, timestamp, maker }: RowProps) => {
  return (
    <div className="flex items-center gap-3">
      <Link href={getUserLink(maker)} className="flex items-center gap-2">
        <Image
          className="w-8 h-8 rounded-full"
          src={maker?.avatar || defaultAvatar}
          alt="user"
          width={32}
          height={32} />
      </Link>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Link href={getUserLink(maker)} className="text-body-16 font-semibold hover:underline">
            {maker?.username || shortenAddress(maker?.signer)}
          </Link>
          <div className="text-secondary">
            {children}
          </div>
        </div>
        <p className="font-semibold text-secondary text-body-14">
          {format((timestamp || 0) * 1000, 'yyyy/dd/mm - hh:mm a')}
        </p>
      </div>
    </div>
  )
}

export default function MarketEvent({ event, className, ...rest }: MarketEventProps) {
  const renderEvent = () => {
    if (!event) {
      return null
    }
    const token = findTokenByAddress(event.quoteToken)
    switch (event.event) {
      case 'AskNew':
        return (
          <Row maker={event.from} timestamp={event.timestamp}>
            <div className="flex items-center gap-1">
              Listed for
              <span className="font-semibold text-primary">
                {formatDisplayedBalance(formatUnits(event.price, 18))}
              </span>
              <Image width={32} height={32} className="w-6 h-6 rounded-full" src={token?.logo || ''} alt="logo" />
              {token?.symbol}
            </div>
          </Row>
        )
      case 'AskCancel':
        return (
          <Row maker={event.from} timestamp={event.timestamp}>
            Cancel Listing
          </Row>
        )
      case 'Trade':
        return (
          <Row maker={event.from} timestamp={event.timestamp}>
            <div className="flex items-center gap-1">
              Sell
              <span className="font-semibold text-primary">
                {event.NFT?.name}
              </span>
              to
              <Link className="text-primary hover:underline" href={getUserLink(event.to)}>{event.to?.username}</Link>
              for
              <span className="font-semibold text-primary">
                {formatDisplayedBalance(formatUnits(event.price, 18))}
              </span>
              <Image width={32} height={32} className="w-6 h-6 rounded-full" src={token?.logo || ''} alt="logo" />
              {token?.symbol}
            </div>
          </Row>
        )
      case 'Bid':
        return (
          <Row maker={event.to} timestamp={event.timestamp}>
            <div className="flex items-center gap-1">
              Placed a bid For
              <span className="font-semibold text-primary">
                {formatDisplayedBalance(formatUnits(event.price, 18))}
              </span>
              <Image width={32} height={32} className="w-6 h-6 rounded-full" src={token?.logo || ''} alt="logo" />
              {token?.symbol}
            </div>
          </Row>
        )
      case 'AcceptBid':
        return (
          <Row maker={event.from} timestamp={event.timestamp}>
            <div className="flex items-center gap-1">
              Accepted bid from
              <Link className="font-semibold text-primary hover:underline" href={getUserLink(event.to)}>
                {event.to?.username}
              </Link>
              For
              <span className="font-semibold text-primary">
                {formatDisplayedBalance(formatUnits(event.price, 18))}
              </span>
              <Image width={32} height={32} className="w-6 h-6 rounded-full" src={token?.logo || ''} alt="logo" />
              {token?.symbol}
            </div>
          </Row>
        )
      case 'CancelBid':
        return (
          <Row maker={event.to} timestamp={event.timestamp}>
            Cancelled bidding
          </Row>
        )
      case 'Mint':
        return (
          <Row maker={event.to} timestamp={event.timestamp}>
            Minted
          </Row>
        )
      case 'Transfer':
        return (
          <Row maker={event.from} timestamp={event.timestamp}>
            <div className="flex items-center gap-1">
              Transferred to
              <Link className="font-semibold text-primary hover:underline" href={getUserLink(event.to)}>{event.to?.username}</Link>
            </div>
          </Row>
        )
      default:
        return ''
    }
  }

  return (
    <div className={classNames('', className)} {...rest}>
      {renderEvent()}
    </div>
  )
}