import { APIParams } from "@/services/api/types";
import { FilterLayerGNFTs } from "@/types";

export interface LayerGNFTFilterState {
  showFilters: boolean;
  filters: FilterLayerGNFTs;
}

export interface LayerGNFTFilterAction {
  toggleFilter: (bool?: boolean) => void;
  setFilters: (filters: FilterLayerGNFTs) => void;
  updateFilters: (filters: FilterLayerGNFTs) => void;
  resetFilters: () => void;
}
