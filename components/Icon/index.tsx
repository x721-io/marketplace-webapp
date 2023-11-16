import { colors } from '@/config/theme'
import defaultColors from 'tailwindcss/colors'
import { useMemo } from 'react'

import U2ULogo from './U2ULogo'
// import BurgerIcon from './Burger'
import ChevronDownIcon from './ChevronDown'
import UploadIcon from './Upload'
import CircleIcon from './Circle'
import MetamaskIcon from './Metamask'
import WalletConnectIcon from './WalletConnect'

type Color = keyof typeof defaultColors & keyof typeof colors

export interface IconProps {
  width?: number;
  height?: number;
  className?: string
  color?: Color | string
}

export default function Icon({ name, width, height, ...rest }: IconProps & { name: string }) {
  const iconW = useMemo(() => width || 20, [width])
  const iconH = useMemo(() => height || 20, [height])

  const renderIcon = () => {
    switch (name) {
      case 'u2u-logo':
        return <U2ULogo width={iconW} height={iconH} />
      // case 'burger':
      //   return <BurgerIcon width={iconW} height={iconH} {...rest} />
      case 'chevronDown':
        return <ChevronDownIcon width={iconW} height={iconH} {...rest} />
      case 'upload':
        return <UploadIcon width={iconW} height={iconH} {...rest} />
      case 'circle':
        return <CircleIcon width={iconW} height={iconH} {...rest} />
      case 'metaMask':
      case 'injected':
        return <MetamaskIcon width={iconW} height={iconH} {...rest} />
      case 'walletConnect':
        return <WalletConnectIcon width={iconW} height={iconH} {...rest} />
      default:
        return null
    }
  }
  return renderIcon()
}