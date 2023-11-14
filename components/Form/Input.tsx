import { classNames } from '@/utils/string'
import React, { useMemo } from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string
  containerClass?: string
  scale?: 'md' | 'lg'
  prependIcon?: React.ReactNode
  prependIconContainerClass?: string
  appendIcon?: React.ReactNode
  appendIconContainerClass?: string
  error?: boolean
  success?: boolean
  errorMessage?: string
}

export default function Input({
  prependIcon,
  prependIconContainerClass,
  appendIcon,
  appendIconContainerClass,
  containerClass,
  scale,
  success,
  error,
  errorMessage,
  className,
  ...rest
}: Props) {
  const baseClass = 'bg-surface-soft outline-none placeholder:text-tertiary focus-visible:ring-[0.5px] flex-1'

  const scaleClass = useMemo(() => {
    switch (scale) {
      case 'lg':
        return classNames(
          'text-body-16 rounded-2xl min-w-72 h-14 p-4',
          !!prependIcon && 'ps-10',
          !!appendIcon && 'pe-10'
        )
      case 'md':
      default:
        return classNames(
          'text-body-16 rounded-2xl min-w-72 h-14 p-3',
          !!prependIcon && 'ps-10',
          !!appendIcon && 'pe-10'
        )
    }
  }, [scale, prependIcon])

  const colorClass = useMemo(() => {
    switch (true) {
      case success:
        return 'text-success ring-success'
      case error:
        return 'text-error border-error border-[0.5px]'
      default:
        return 'text-primary focus-visible:ring-primary border-none'
    }
  }, [success, error])

  return (
    <div className={classNames(containerClass, 'flex items-center relative w-auto')}>
      {
        !!prependIcon && (
          <div className={classNames("absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none", prependIconContainerClass)}>
            {prependIcon}
          </div>
        )
      }
      <input
        className={classNames(baseClass, scaleClass, colorClass, className)}
        {...rest}
      />
      {
        !!appendIcon && (
          <div className={classNames('absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none', appendIconContainerClass)}>
            {appendIcon}
          </div>
        )
      }
    </div>
  )
}