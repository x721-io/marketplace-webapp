import { CustomFlowbiteTheme } from 'flowbite-react'

const tab: CustomFlowbiteTheme['tab'] = {
  base: 'flex flex-col gap-2 block',
  tablist: {
    base: 'inline-flex text-center p-1 w-full',
    styles: {
      default: 'flex-wrap bg-surface-soft rounded-2xl',
      underline: 'flex-wrap border-b border-gray-200 p-0'
    },
    tabitem: {
      base: 'flex items-center justify-center px-4 py-3 text-body-14 font-medium first:ml-0 disabled:cursor-not-allowed focus:outline-none',
      styles: {
        default: {
          base: 'rounded-xl flex-1',
          active: {
            on: 'bg-white text-primary shadow',
            off: 'text-secondary bg-transparent'
          }
        },
        underline: {
          base: 'text-sm',
          active: {
            on: 'text-primary border-b-2 border-primary',
            off: 'text-secondary bg-transparent'
          }
        },
      }
    }
  }
}

const appTheme: CustomFlowbiteTheme = {
  tab
}

export default appTheme