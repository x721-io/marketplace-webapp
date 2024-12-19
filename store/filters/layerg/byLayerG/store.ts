import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LayerGNFTFilterAction, LayerGNFTFilterState } from "./types";

export const DEFAULT_LAYER_G_NFT_FILTERS_STATE: LayerGNFTFilterState = {
  showFilters: false,
  filters: {
    collectionName: "",
    collectionAddress: "",
    categoryName: "",
    symbol: "",
    page: 1,
    limit: 20,
    nftName: "",
    status: {
      order: "",
      orderBy: "",
      orderStatus: "",
      orderType: "",
    },
  },
};

export const useLayerGNFTFilterStore = create(
  devtools<LayerGNFTFilterState & LayerGNFTFilterAction>(
    (set, get) => ({
      ...DEFAULT_LAYER_G_NFT_FILTERS_STATE,
      toggleFilter: (bool) =>
        set((state) => ({
          showFilters: bool === undefined ? !state.showFilters : bool,
        })),
      setFilters: (filters) => set(() => ({ filters })),
      updateFilters: (filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
        })),
      resetFilters: () =>
        set((state) => ({
          ...DEFAULT_LAYER_G_NFT_FILTERS_STATE,
          showFilters: state.showFilters,
        })),
    }),
    { name: "layer-g-nft-filter" }
  )
);
