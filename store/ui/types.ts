export type FilterKey = 'collections' | 'nfts' | 'profile'
export type SearchKey = 'collections' | 'collection' | 'nfts' | 'users'

export interface UIState {
  showFilters: Record<FilterKey, boolean>
  queryString: Record<SearchKey, string>
}

export interface UIAction {
  toggleFilter: (key: FilterKey, bool?: boolean) => void
  setQueryString: (key: SearchKey, text: string) => void
}