// import useSWR from 'swr';

import { nextAPI } from "@/services/api";

import { API_ENDPOINTS } from "@/config/api";
import { Address, parseUnits } from "viem";
import { User } from "@/types";
import { AxiosResponse } from "axios";
import { sanitizeObject } from "@/utils";
import { APIParams, APIResponse } from "@/services/api/types";
// import useSWRInfinite from 'swr/infinite';
import { NextAPIResponse } from "@/types/api/api.response";
import useSWRMutation from "swr/mutation";

export const useUpdateProfile = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.PROFILE,
    async (url: string, { arg }: { arg: APIParams.UpdateProfile }) => {
      const response = await nextAPI.post(API_ENDPOINTS.PROFILE, arg);
      return response.data.data;
    }
  );

  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useSearchNfts = (text: any) => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    text.nft ? [text.nft] : null,
    async (key: any) => {
      const response = await nextAPI.post(API_ENDPOINTS.SEARCH, {
        mode: "NFT",
        text: key[0],
      });
      return response.data.data;
    }
  );

  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useSearchCollections = (text: any) => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    text.collection ? [text.collection] : null,
    async (key: any) => {
      const response = await nextAPI.post(API_ENDPOINTS.SEARCH, {
        mode: "COLLECTION",
        text: key[0],
      });
      return response.data.data;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useSearchUsers = (text: any) => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    text.user ? [text.user] : null,
    async (key: any) => {
      const response = await nextAPI.post(API_ENDPOINTS.SEARCH, {
        mode: "USER",
        text: key[0],
      });
      return response.data.data;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};
