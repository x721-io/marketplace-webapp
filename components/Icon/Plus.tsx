import { classNames } from '@/utils/string'
import { IconProps } from './index'

export default function PlusIcon({ color, className, width, height }: IconProps) {
  return (
    <svg 
        width={width}
        height={height} 
        className={classNames(`text-${color}`, className)}
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg">
        <rect 
            width={width}
            height={height}
            rx="8" 
            fill="#040404"/>
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M18 14C18.2761 14 18.5 14.2239 18.5 14.5V21.5C18.5 21.7761 18.2761 22 18 22C17.7239 22 17.5 21.7761 17.5 21.5V14.5C17.5 14.2239 17.7239 14 18 14Z" 
                fill="white"/>
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M14 18C14 17.7239 14.2239 17.5 14.5 17.5H21.5C21.7761 17.5 22 17.7239 22 18C22 18.2761 21.7761 18.5 21.5 18.5H14.5C14.2239 18.5 14 18.2761 14 18Z" 
                fill="white"/>
    </svg>
    
  )
}