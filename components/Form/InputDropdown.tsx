import React, { useEffect, useRef, useState } from 'react'
import Input, { BaseInputProps } from '@/components/Form/Input'
import { classNames } from '@/utils/string'
import { Spinner } from 'flowbite-react'

interface Props extends BaseInputProps {
  className?: string
  loading?: boolean
  children?: React.ReactNode
}

export default function InputDropdown({ className, loading, children, ...rest }: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  const handler = (event: any) => {
    if (!container || !container.current || !children) return
    if (!container.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });

  return (
    <div className={classNames('relative', className)} ref={container}>
      <Input {...rest} onFocus={() => !!children && setShowDropdown(true)} />

      <div
        className={classNames(
          'w-full p-6 rounded-2xl absolute z-50 border-[0.5px] shadow-sm mt-1 transition-all bg-white',
          showDropdown ? 'block' : 'hidden')
        }
      >
        {loading ? <div className="flex flex-col justify-center items-center">
          <Spinner size="xl" />
        </div> : children}
      </div>
    </div>
  )
}