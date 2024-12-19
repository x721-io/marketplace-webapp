import { APIParams } from "@/services/api/types";

export interface LayerGNFTFilterState {
  showFilters: boolean;
  filters: APIParams.FetchLayerGNFTs;
}

export interface LayerGNFTFilterAction {
  toggleFilter: (bool?: boolean) => void;
  setFilters: (filters: APIParams.FetchLayerGNFTs) => void;
  updateFilters: (filters: APIParams.FetchLayerGNFTs) => void;
  resetFilters: () => void;
}
