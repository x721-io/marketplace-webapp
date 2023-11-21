import { classNames } from '@/utils/string'
import { UseFormRegisterReturn } from 'react-hook-form'

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  register: UseFormRegisterReturn
}

export default function Textarea({ className, register, ...rest }: Props) {
  const baseClass = 'bg-surface-soft outline-none placeholder:text-tertiary focus-visible:ring-[0.5px] w-full text-body-14 rounded-2xl min-w-72 h-12 p-4 text-primary focus-visible:ring-primary border-none'

  return (
    <textarea className={classNames(baseClass, className)} {...register} {...rest} />
  )
}