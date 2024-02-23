import { APIParams } from '@/services/api/types';

export interface NFTFiltersState {
  showFilters: boolean;
  filters: APIParams.FetchNFTs
}

export interface NFTFiltersActions {
  toggleFilter: (bool?: boolean) => void;
  setFilters: (filters: APIParams.FetchNFTs) => void
  updateFilters: (filters: Partial<APIParams.FetchNFTs>) => void
  resetFilters: () => void
}
