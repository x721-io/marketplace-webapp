import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { NFTFiltersState, NFTFiltersActions } from './types';

export const DEFAULT_NFT_FILTERS_STATE: NFTFiltersState = {
  showFilters: false,
  filters: {
    traits: [],
    type: undefined,
    collectionAddress: undefined,
    creatorAddress: undefined,
    priceMax: '',
    priceMin: '',
    sellStatus: undefined,
    owner: undefined,
    page: 1,
    limit: 20
  },
};

export const useNFTsFiltersStore = create(
  devtools<NFTFiltersState & NFTFiltersActions>(
    (set, get) => ({
      ...DEFAULT_NFT_FILTERS_STATE,
      toggleFilter: (bool) => set((state) => ({
        showFilters: bool === undefined ? !state.showFilters : bool
      })),
      setFilters: (filters) => set(() => ({ filters })),
      updateFilters: (filters) => set((state) => ({
        filters: {
          ...state.filters,
          ...filters
        }
      })),
      resetFilters: () => set((state) => ({ ...DEFAULT_NFT_FILTERS_STATE, showFilters: state.showFilters }))
    }),
    { name: 'nft-filters' }
  )
);