import { colors } from '@/config/theme'
import defaultColors from 'tailwindcss/colors'
import BurgerIcon from '@/components/Icon/burger'

type Color = keyof typeof defaultColors & keyof typeof colors

export interface IconProps {
  width?: number;
  height?: number;
  className?: string
  color?: Color
}

export default function Icon({ name, width, height, className, color }: IconProps & { name: string }) {
  const renderIcon = () => {
    switch (name) {
      case 'burger':
        return <BurgerIcon />
    }
  }
  return renderIcon()
}