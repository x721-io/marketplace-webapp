import { APIParams } from "@/services/api/types";

export interface BaseFilterState {
  categoryFilters: APIParams.LayerGCategory;
  projectFilters: APIParams.LayerGProjects;
  collectionFilters: APIParams.LayerGSmartContract;
  statusFilters: APIParams.LayerGStatus;
}

export interface BaseFilterAction {
  setCategoryFilters: (category: APIParams.LayerGCategory) => void;
  setProjectFilters: (project: APIParams.LayerGProjects) => void;
  setCollectionFilters: (collection: APIParams.LayerGSmartContract) => void;
  setStatusFilters: (status: APIParams.LayerGStatus) => void;
  updateCategoryFilters: (category: APIParams.LayerGCategory) => void;
  updateProjectFilters: (project: APIParams.LayerGProjects) => void;
  updateCollectionFilters: (collection: APIParams.LayerGSmartContract) => void;
  updateStatusFilters: (status: APIParams.LayerGStatus) => void;
  resetFilters: () => void;
}
