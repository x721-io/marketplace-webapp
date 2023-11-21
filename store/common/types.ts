import { APIResponse } from '@/services/api/types'

export interface AppStoreState {
  collections: Record<string, APIResponse.Collection[]>
}

export interface AppStoreAction {
  setCollection: (userId: string, collections: APIResponse.Collection[]) => void
}