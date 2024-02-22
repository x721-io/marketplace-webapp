import { APIParams } from '@/services/api/types';

export interface CollectionsFiltersState {
  showFilters: boolean;
  filters: APIParams.FetchCollections
  hasNext: boolean
}

export interface CollectionsFiltersActions {
  toggleFilter: (bool?: boolean) => void;
  setFilters: (filters: APIParams.FetchCollections) => void
  updateFilters: (filters: Partial<APIParams.FetchCollections>) => void
  resetFilters: () => void
}
