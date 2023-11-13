import { devtools, persist } from 'zustand/middleware'
import { create } from 'zustand'
import { AuthStoreAction, AuthStoreState } from '@/store/auth/types'

const DEFAULT_STATE: AuthStoreState = {
  token: null,
  profile: null
}

const useAuthStore = create(devtools(persist<AuthStoreState & AuthStoreAction>(
  (set, get) => ({
    ...DEFAULT_STATE,
    connectWallet: (token) => set(() => ({ token })),
    setProfile: (profile) => set(() => ({ profile }))
  }),
  { name: 'wallet-storage' }
)))

export default useAuthStore