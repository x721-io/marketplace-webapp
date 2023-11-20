import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { UIAction, UIState } from '@/store/ui/types'

const DEFAULT_STATE: UIState = {
  showFilters: {
    collections: false,
    nfts: false,
    profile: false
  }
}

export const useUIStore = create(devtools(persist<UIState & UIAction>(
  (set, get) => ({
    ...DEFAULT_STATE,
    toggleFilter: (key, bool) => set((state) => {
      return {
        showFilters: {
          ...state.showFilters,
          [key]: bool ?? !state.showFilters[key]
        }
      }
    })
  }),
  { name: 'ui-storage' }
)))