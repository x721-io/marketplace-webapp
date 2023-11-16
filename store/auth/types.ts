import { APIResponse } from '@/services/api/types'

export interface AuthStoreState {
  credentials: APIResponse.Connect | null
  profile: APIResponse.Profile | null
}

export interface AuthStoreAction {
  setCredentials: (credentials: APIResponse.Connect) => void
  setProfile: (profile: APIResponse.Profile) => void
}