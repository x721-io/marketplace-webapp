import { IconProps } from './index'
import { classNames } from '@/utils/string'

export default function BurgerIcon({ width, height, color, className }: IconProps) {
  return (
    <svg
      className={classNames('w-5 h-5', `text-${color}`, className)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 17 14">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M1 1h15M1 7h15M1 13h15" />
    </svg>
  )
}