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
        }
      }
    }
  },
  tabpanel: ''
}

const table: CustomFlowbiteTheme['table'] = {
  root: {
    base: "w-full text-left text-sm text-secondary dark:text-gray-400 rounded-2xl",
    shadow: "absolute bg-white dark:bg-black w-full h-full top-0 left-0 rounded-lg shadow -z-10"
  },
  head: {
    base: "group/head text-heading-xs uppercase text-secondary font-semibold dark:text-gray-400"
  }
}

const accordion: CustomFlowbiteTheme['accordion'] = {
  content: {
    base: "py-5 px-5 last:rounded-b-lg first:rounded-t-lg"
  },
  title: {
    flush: {
      on: '',
      off: ''
    }
  }
}

const modal: CustomFlowbiteTheme['modal'] = {
  content: {
    inner: "relative rounded-lg bg-white shadow flex flex-col max-h-[90vh]",
    base: "relative h-full w-full p-4",
  }
}

const appTheme: CustomFlowbiteTheme = {
  tab,
  table,
  accordion,
  modal
}

export default appTheme
