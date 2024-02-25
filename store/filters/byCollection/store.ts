import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { NFTFilterByCollectionState, NFTFiltersByCollectionActions } from './types';

const DEFAULT_FILTERS_BY_COLLECTION = {
  showFilters: false,
  filters: {
    traits: [],
    name: '',
    type: undefined,
    collectionAddress: undefined,
    creatorAddress: undefined,
    priceMax: '',
    priceMin: '',
    sellStatus: undefined,
    owner: undefined,
    page: 1,
    limit: 20
  }
};

export const useFiltersByCollection = create(
  devtools<NFTFilterByCollectionState & NFTFiltersByCollectionActions>(
    (set, get) => ({
      ...{},
      createFiltersForCollection: (collectionAddress) => set((state) => {
        return {
          [collectionAddress]: DEFAULT_FILTERS_BY_COLLECTION
        };
      }),
      toggleFilter: (collectionAddress, bool) => set((state) => {
        if (!state[collectionAddress]) return state;

        return {
          [collectionAddress]: {
            ...state[collectionAddress],
            showFilters: bool === undefined ? !state[collectionAddress].showFilters : bool
          }
        };
      }),
      setFilters: (collectionAddress, filters) => set((state) => {
        if (!state[collectionAddress]) return state;
        return {
          [collectionAddress]: {
            ...state[collectionAddress],
            filters
          }
        }
      }),
      updateFilters: (collectionAddress, filters) => set((state) => {
        if (!state[collectionAddress]) return state;
        return {
          [collectionAddress]: {
            ...state[collectionAddress],
            filters: {
              ...state[collectionAddress].filters,
              ...filters
            }
          }
        }
      }),
      resetFilters: (collectionAddress) => set((state) => {
        if (!state[collectionAddress]) return state;
        return {
          [collectionAddress] : {
            filters: {
              ...DEFAULT_FILTERS_BY_COLLECTION.filters,
              collectionAddress,
            },
            showFilters: state[collectionAddress].showFilters
          }
        }
      })
    }),
    { name: 'filter-by-collection' }
  )
);