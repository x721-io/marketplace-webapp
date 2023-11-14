import { useMemo } from 'react'
import { classNames } from '@/utils/string'
import Input from '@/components/Form/Input'
import Icon from '@/components/Icon'

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
    <div>
      <Input
        appendIcon={<Icon name="" />}
      />
    </div>
  )
}