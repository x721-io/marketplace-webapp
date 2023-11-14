import { colors } from '@/config/theme'
import defaultColors from 'tailwindcss/colors'
import { useMemo } from 'react'

import U2ULogo from './U2ULogo'
import BurgerIcon from './Burger'
import ChevronDownIcon from './ChevronDown'

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
      case 'burger':
        return <BurgerIcon width={iconW} height={iconH} {...rest} />
      case 'chevron-down':
        return <ChevronDownIcon width={iconW} height={iconH} {...rest} />
      default:
        return null
    }
  }
  return renderIcon()
}