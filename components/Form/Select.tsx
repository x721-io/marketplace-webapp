import { useMemo } from 'react'
import { classNames } from '@/utils/string'

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string, value: any }[]
}

export default function Select({ className, options = [], ...rest }: Props) {
  const selectClass = useMemo(() => {
    return classNames(
      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 focus:border-none',
      className
    )
  }, [className])

  return (
    <select className={selectClass} {...rest}>
      {options.map(option => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}