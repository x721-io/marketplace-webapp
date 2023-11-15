import { classNames } from '@/utils/string'


export default function Textarea({ className, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const baseClass = 'bg-surface-soft outline-none placeholder:text-tertiary focus-visible:ring-[0.5px] w-full text-body-14 rounded-2xl min-w-72 h-12 p-3 ps-10 text-primary focus-visible:ring-primary border-none'

  return (
    <div>
        <textarea 
            className={classNames(baseClass, className)}>
        </textarea>
    </div>
  )
}