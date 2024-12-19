import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { BaseFilterAction, BaseFilterState } from "./types";
import { CHAIN_ID } from "@/config/constants";

export const DEFAULT_LAYER_G_BASE_FILTERS_STATE: BaseFilterState = {
  categoryFilters: {
    name: "",
    page: 1,
    limit: 10,
  },
  projectFilters: {
    name: "",
    page: 1,
    limit: 10,
  },
  collectionFilters: {
    networkID: Number(CHAIN_ID),
    contractAddress: "",
    contractName: "",
    projectId: "",
    page: 1,
    limit: 10,
  },
  statusFilters: {
    order: "all",
    orderBy: "desc",
    orderStatus: "",
    orderType: "",
  },
};

export const useLayergBaseFilterStore = create(
  devtools<BaseFilterState & BaseFilterAction>(
    (set, get) => ({
      ...DEFAULT_LAYER_G_BASE_FILTERS_STATE,
      setCategoryFilters: (categoryFilters) => set(() => ({ categoryFilters })),

      setProjectFilters: (projectFilters) => set(() => ({ projectFilters })),

      setCollectionFilters: (collectionFilters) =>
        set(() => ({ collectionFilters })),

      setStatusFilters: (statusFilters) => set(() => ({ statusFilters })),

      updateCategoryFilters: (filters) =>
        set((state) => ({
          categoryFilters: {
            ...state.categoryFilters,
            ...filters,
          },
        })),
      updateProjectFilters: (filters) =>
        set((state) => ({
          projectFilters: {
            ...state.projectFilters,
            ...filters,
          },
        })),
      updateCollectionFilters: (filters) =>
        set((state) => ({
          collectionFilters: {
            ...state.collectionFilters,
            ...filters,
          },
        })),
      updateStatusFilters: (filters) =>
        set((state) => ({
          statusFilters: { ...state.statusFilters, ...filters },
        })),
      resetFilters: () =>
        set((state) => ({
          ...DEFAULT_LAYER_G_BASE_FILTERS_STATE,
        })),
    }),
    { name: "layer-g-base-filter" }
  )
);
