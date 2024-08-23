import useSWR from "swr";
import { nextAPI } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";
import { Address, parseUnits } from "viem";
import { sanitizeObject } from "@/utils";
import { APIParams, APIResponse } from "@/services/api/types";
import useSWRInfinite from "swr/infinite";
import { NextAPIResponse } from "@/types/api/api.response";
import useSWRImmutable from "swr/immutable";
import axios from "axios";

export const useGetProfile = (id: Address | string) => {
  const { data, error, isLoading, mutate } =
    useSWR<NextAPIResponse.GetUserProfile>(
      `${API_ENDPOINTS.PROFILE}/${id}`,
      nextAPI.get
    );
  return {
    data: data?.data?.data ?? null,
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
      return response.data.data;
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
      return response.data.data;
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
      return response.data.data;
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
  const { data, error, isLoading, mutate } =
    useSWR<NextAPIResponse.GetCollectionDetails>(
      id ? `${API_ENDPOINTS.COLLECTIONS + `/${id}`}` : null,
      nextAPI.get,
      {
        refreshInterval: 30000,
        onSuccess: (data) => {
          onSuccess(data.data.data);
        },
      }
    );
  return {
    data: data?.data?.data ?? null,
    error,
    isLoading,
    mutate,
  };
};

export const useGetLaunchpadProjects = (
  mode: "MINTING" | "UPCOMING" | "ENDED" | "CLAIM"
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_ENDPOINTS.LAUNCHPAD}/${mode}`,
    () => {
      return nextAPI.get(API_ENDPOINTS.LAUNCHPAD, { params: { mode } });
    },
    {
      revalidateOnFocus: false,
    }
  );
  return {
    data: data?.data?.data ?? null,
    error,
    isLoading,
    mutate,
  };
};

export const useGetLaunchpadProjectById = (id: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `${API_ENDPOINTS.LAUNCHPAD}/${id}` : null,
    () => {
      return nextAPI.get(`${API_ENDPOINTS.LAUNCHPAD}/${id}`);
    },
    {
      revalidateOnFocus: false,
    }
  );
  return {
    data: data?.data?.data ?? null,
    error,
    isLoading,
    mutate,
  };
};

export const useGetMarketDataByNftId = (
  collectionAddress: string,
  id: string
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [
      "nft-market-data",
      { collectionAddress: String(collectionAddress), id: String(id) },
    ],
    (key: any) => {
      return nextAPI.get(API_ENDPOINTS.NFT_TRANSACTIONS, {
        params: {
          ...key[1],
          bidListPage: 1,
          bidListLimit: 100,
        },
      });
    },
    { refreshInterval: 10000 }
  );
  return {
    data: data?.data?.data ?? null,
    error,
    isLoading,
    mutate,
  };
};

export const useGetNftMetadata = (item?: any) => {
  const { data, error, isLoading, mutate } = useSWRImmutable(
    !!item?.tokenUri ? item.tokenUri : null,
    async (key: string) => {
      if (key.startsWith("http")) {
        const response = await axios(key, { method: "GET" });
        return response;
      }
      const response = await nextAPI.get(
        API_ENDPOINTS.GET_METADATA + `?ipfsPath=${key}`
      );
      return response.data;
    },
    { refreshInterval: 600000 }
  );
  return {
    data: data?.data ?? null,
    error,
    isLoading,
    mutate,
  };
};

export const useGetTotalCountById = (
  key: string,
  address: Address,
  mode: string
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [key, { address, mode }],
    (key: any) => {
      let params: any = { mode: key[1].mode };
      switch (params.mode) {
        case "creator":
          params.creatorAddress = address;
          break;
        case "onsales":
        case "owner":
        case "collection":
          params.owner = address;
          break;
      }
      return nextAPI.post(API_ENDPOINTS.TOTAL_COUNT, params);
    },
    {
      refreshInterval: 0,
    }
  );
  return {
    data: data?.data?.data ?? null,
    error,
    isLoading,
    mutate,
  };
};
