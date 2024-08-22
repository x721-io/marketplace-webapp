import useSWR from "swr";

import { nextAPI } from "@/services/api";

import { API_ENDPOINTS } from "@/config/api";
import { Address, parseUnits } from "viem";
import { User } from "@/types";
import { AxiosResponse } from "axios";
import { sanitizeObject } from "@/utils";
import { APIParams, APIResponse } from "@/services/api/types";
import useSWRInfinite from "swr/infinite";

export const useGetProfile = (id: Address | string) => {
  const { data, error, isLoading, mutate } = useSWR<AxiosResponse<User>>(
    `${API_ENDPOINTS.PROFILE}/${id}`,
    nextAPI.get
  );
  return {
    data: data?.data ?? null,
    error,
    isLoading,
    mutate,
  };
};

export const useGetUsers = (params: APIParams.FetchUsers) => {
  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    (index) => ({
      ...params,
      page: index + 1,
    }),

    async (params) => {
      const response = await nextAPI.get(API_ENDPOINTS.USER, {
        params: sanitizeObject(params),
      });
      return response.data;
    }
  );

  return {
    data: data ?? [],
    error,
    isLoading,
    size,
    setSize,
    mutate,
  };
};

export const useGetCollections = (params: APIParams.FetchCollections) => {
  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    (index) => ({
      ...params,
      page: index + 1,
    }),

    async (params) => {
      const { min, max } = params;
      const bigintMin =
        min !== undefined && min !== "" ? parseUnits(min, 18) : undefined;
      const bigintMax =
        max !== undefined && max !== "" ? parseUnits(max, 18) : undefined;
      const response = await nextAPI.get(API_ENDPOINTS.COLLECTIONS, {
        params: sanitizeObject({
          ...params,
          min: bigintMin?.toString(),
          max: bigintMax?.toString(),
        }),
      });
      return response.data;
    }
  );

  return {
    data: data ?? [],
    error,
    isLoading,
    size,
    setSize,
    mutate,
  };
};

export const useGetNFTs = (params: APIParams.FetchNFTs) => {
  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    (index) => ({
      ...params,
      page: index + 1,
    }),
    async (params) => {
      const { priceMin, priceMax, quoteToken } = params;
      const bigintMin =
        priceMin !== undefined && priceMin !== ""
          ? parseUnits(priceMin, 18)
          : undefined;
      const bigintMax =
        priceMax !== undefined && priceMax !== ""
          ? parseUnits(priceMax, 18)
          : undefined;
      const response = await nextAPI.post(
        API_ENDPOINTS.SEARCH_NFT,
        sanitizeObject({
          ...params,
          sellStatus:
            Number(priceMin) || Number(priceMax) ? "AskNew" : params.sellStatus,
          priceMin: bigintMin?.toString(),
          priceMax: bigintMax?.toString(),
        })
      );
      return response.data;
    }
  );

  return {
    data: data ?? [],
    error,
    isLoading,
    size,
    setSize,
    mutate,
  };
};

export const useGetCollectionById = (
  id: string | null,
  onSuccess: (data: APIResponse.CollectionDetails) => void
) => {
  const { data, error, isLoading, mutate } = useSWR<
    AxiosResponse<APIResponse.CollectionDetails>
  >(id ? `${API_ENDPOINTS.COLLECTIONS + `/${id}`}` : null, nextAPI.get, {
    refreshInterval: 30000,
    onSuccess: (data) => {
      onSuccess(data.data);
    },
  });
  return {
    data: data?.data ?? null,
    error,
    isLoading,
    mutate,
  };
};

// const {
//   data: collectionData,
//   isLoading: isLoadingCollection,
//   error: collectionError,
// } = useSWR(!!id ? id : null, (id: string) => api.fetchCollectionById(id), {
//   refreshInterval: 30000,
//   onSuccess: (data) => {
//     const collectionAddress = data?.collection.address;
//     filterStore.createFiltersForCollection(collectionAddress);
//     filterStore.updateFilters(collectionAddress, { collectionAddress });
//   },
// });
