type PageKey = 'collections' | 'nfts' | 'profile'

export interface UIState {
  showFilters: Record<PageKey, boolean>
}

export interface UIAction {
  toggleFilter: (key: PageKey, bool?: boolean) => void
}