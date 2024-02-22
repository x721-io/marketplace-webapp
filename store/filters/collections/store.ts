import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CollectionsFiltersState, CollectionsFiltersActions } from './types';
import { APIParams } from '@/services/api/types';

const DEFAULT_STATE: CollectionsFiltersState = {
  showFilters: false,
  filters: {
    creatorAddress: undefined,
    name: '',
    min: '',
    max: '',
    page: 1,
    limit: 5
  },
  hasNext: false
};

export const useCollectionsFiltersStore = create(
  devtools<CollectionsFiltersState & CollectionsFiltersActions>(
    (set, get) => ({
      ...DEFAULT_STATE,
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
      resetFilters: () => set((state) => ({ ...DEFAULT_STATE, showFilters: state.showFilters }))
    }),
    { name: 'collections-filters' }
  )
);