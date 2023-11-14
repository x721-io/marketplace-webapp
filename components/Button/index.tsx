"use client"

import { useMemo } from 'react'
import { classNames } from '@/utils/string'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  scale?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'text'
}

export default function Button({ scale, variant, children, disabled, ...rest }: Props) {
  const baseClass = useMemo(() => {
    return `focus:outline-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer '}`
  }, [disabled])

  const scaleClass = useMemo(() => {
    switch (scale) {
      case "lg":
        return 'px-6 py-3.5 h-[52px] min-w-40 text-body-18 rounded-xl'
      case "sm":
        return 'px-4 py-2 h-9 min-w-[120px] text-body-14 rounded-lg'
      case "md":
      default:
        return 'px-5 py-3 h-11 min-w-[120px] text-body-14 rounded-xl'
    }
  }, [scale])

  const variantClass = useMemo(() => {
    switch (variant) {
      case 'text':
        if (disabled) return 'text-disabled'
        return 'bg-transparent text-primary'
      case 'secondary':
        if (disabled) return 'bg-gray-100 text-disabled'
        return 'text-primary bg-button-secondary hover:bg-gray-200'
      case 'primary':
      default:
        if (disabled) return 'text-gray-0 bg-disabled'
        return 'text-gray-0 bg-button hover:bg-gray-700'
    }
  }, [variant, disabled])

  return (
    <button
      type="button"
      disabled={disabled}
      className={classNames(baseClass, scaleClass, variantClass)}
      {...rest}
    >
      {children}
    </button>
  )
}