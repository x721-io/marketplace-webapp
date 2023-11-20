import { colors } from '@/config/theme'
import defaultColors from 'tailwindcss/colors'
import { useMemo } from 'react'

import U2ULogo from './U2ULogo'
import BurgerIcon from './Burger'
import ChevronDownIcon from './ChevronDown'
import UploadIcon from './Upload'
import CircleIcon from './Circle'
import MetamaskIcon from './Metamask'
import WalletConnectIcon from './WalletConnect'
import ArrowRightIcon from './ArrowRight'
import PlusCircleIcon from '@/components/Icon/PlusCircle'
import SliderIcon from '@/components/Icon/Slider'
import VerifiedIcon from '@/components/Icon/Verified'

type Color = keyof typeof defaultColors & keyof typeof colors

export interface IconProps {
  width?: number;
  height?: number;
  className?: string
  color?: Color | string
}

export default function Icon({ name, width, height, ...rest }: IconProps & {
  name: string
}) {
  const iconW = useMemo(() => width || 20, [width])
  const iconH = useMemo(() => height || 20, [height])

  const renderIcon = () => {
    switch (name) {
      case 'u2u-logo':
        return <U2ULogo width={iconW} height={iconH} />
      case 'burger':
        return <BurgerIcon width={iconW} height={iconH} {...rest} />
      case 'chevronDown':
        return <ChevronDownIcon width={iconW} height={iconH} {...rest} />
      case 'arrow-right':
        return <ArrowRightIcon width={iconW} height={iconH} {...rest} />
      case 'upload':
        return <UploadIcon width={iconW} height={iconH} {...rest} />
      case 'circle':
        return <CircleIcon width={iconW} height={iconH} {...rest} />
      case 'metaMask':
      case 'injected':
        return <MetamaskIcon width={iconW} height={iconH} {...rest} />
      case 'walletConnect':
        return <WalletConnectIcon width={iconW} height={iconH} {...rest} />
      case 'plusCircle':
        return <PlusCircleIcon width={iconW} height={iconH} {...rest} />
      case 'slider':
        return <SliderIcon width={iconW} height={iconH} {...rest} />
      case 'verified':
        return <VerifiedIcon width={iconW} height={iconH} />
      default:
        return null
    }
  }
  return renderIcon()
}