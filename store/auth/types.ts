export interface Profile {
  wallet: string
  username?: string
  email?: string
  avatar?: string
  coverImage?: string
}

export interface AuthStoreState {
  token: string | null
  profile: Profile | null
}

export interface AuthStoreAction {
  connectWallet: (token: string) => void
  setProfile: (profile: Profile) => void
}