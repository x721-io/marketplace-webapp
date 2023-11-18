import { classNames } from '@/utils/string'

export default function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const baseClass = 'bg-surface-soft outline-none placeholder:text-tertiary focus-visible:ring-[0.5px] w-full text-body-14 rounded-2xl min-w-72 h-12 p-4 text-primary focus-visible:ring-primary border-none'

  return (
    <textarea className={classNames(baseClass, className)} {...rest} />
  )
}