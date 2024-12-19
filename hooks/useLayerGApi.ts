"use client";

import { APIParams, APIResponse } from "@/services/api/types";
import { layerGApi } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";
import { parseQueries } from "@/utils";

export const useLayergApi = () => {
  return {
    getCategoryData: (
      params: APIParams.LayerGCategory
    ): Promise<APIResponse.LayerGCategory> => {
      return layerGApi.get(API_ENDPOINTS.CATEGORY + parseQueries(params));
    },

    getProjectData: (
      params: APIParams.LayerGProjects
    ): Promise<APIResponse.GetLayerGProjects> => {
      return layerGApi.get(
        API_ENDPOINTS.LAYER_G_PROJECT + parseQueries(params)
      );
    },

    getSmartContractData: (
      params: APIParams.LayerGSmartContract
    ): Promise<APIResponse.GetLayerGSmartContracts> => {
      return layerGApi.get(
        API_ENDPOINTS.LAYER_G_SMART_CONTRACT + parseQueries(params)
      );
    },
  };
};
