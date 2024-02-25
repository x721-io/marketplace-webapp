import { APIParams } from '@/services/api/types';
import { Address } from 'wagmi';

export type NFTFilterByCollectionState = Record<Address, {
  showFilters: boolean;
  filters: APIParams.FetchNFTs
}>

export interface NFTFiltersByCollectionActions {
  createFiltersForCollection: (address: Address) => void;
  toggleFilter: (address: Address, bool?: boolean) => void;
  setFilters: (address: Address, filters: APIParams.FetchNFTs) => void;
  updateFilters: (address: Address, filters: Partial<APIParams.FetchNFTs>) => void;
  resetFilters: (address: Address) => void;
}
