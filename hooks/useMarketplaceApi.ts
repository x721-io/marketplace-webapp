"use client";

import { APIParams, APIResponse } from "@/services/api/types";
import { getMarketplaceApi, marketplaceApi, nextAPI } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";
import { Address } from "abitype";
import { useCallback, useContext, useMemo } from "react";
import { parseQueries, sanitizeObject } from "@/utils";
import { parseUnits } from "ethers";
import { AuthenticationContext } from "@/app/auth-provider";
import { clearAuthCookiesAction, handleAuthentication } from "@/actions";
import { useRouter } from "next/navigation";
import useAuthStore, { clearProfile } from "@/store/auth/store";

export const useMarketplaceApi = () => {
  const { setProfile } = useAuthStore();
  const { credentials } = useContext(AuthenticationContext);
  const bearerToken = credentials?.accessToken;
  const router = useRouter();

  // Bearer token - Support directly passing token via function call or getting from auth store
  const authHeader = useCallback(
    (accessToken?: string) => ({
      headers: { Authorization: `Bearer ${accessToken || bearerToken}` },
    }),
    [bearerToken]
  );

  return useMemo(() => {
    return {
      connect: (params: APIParams.Connect): Promise<APIResponse.Connect> =>
        marketplaceApi.post(API_ENDPOINTS.CONNECT, params),

      updateProfile: async (
        params: APIParams.UpdateProfile
      ): Promise<{ data: { data: APIResponse.ProfileDetails } } | null> => {
        const response = await handleAuthentication();

        if (response.status === "fail") {
          clearAuthCookiesAction();
          clearProfile();
          router.push("/");
          return null;
        }

        nextAPI.defaults.headers.common.Authorization = response.bearerToken;

        return nextAPI.post(API_ENDPOINTS.PROFILE, params);
      },

      resendEmail: (
        params: APIParams.ResendVerifyMail
      ): Promise<APIResponse.ResendEmail> =>
        marketplaceApi.post(
          API_ENDPOINTS.SEND_VERIFY_EMAIL,
          params,
          authHeader()
        ),
      search: (params: APIParams.Search): Promise<any> =>
        marketplaceApi.post(API_ENDPOINTS.SEARCH, params),

      searchNFTs: (text: string): Promise<APIResponse.SearchNFTs> =>
        marketplaceApi.post(API_ENDPOINTS.SEARCH, {
          mode: "NFT",
          text,
        }),

      searchCollections: (
        text: string
      ): Promise<APIResponse.SearchCollections> =>
        marketplaceApi.post(API_ENDPOINTS.SEARCH, {
          mode: "COLLECTION",
          text,
        }),

      searchUsers: (text: string): Promise<APIResponse.SearchUsers> =>
        marketplaceApi.post(API_ENDPOINTS.SEARCH, {
          mode: "USER",
          text,
        }),

      uploadFile: (
        files: Blob[] | Blob,
        metadata?: Record<string, any>
      ): Promise<APIResponse.UploadImage> => {
        const form = new FormData();
        if (Array.isArray(files)) {
          files.forEach((file) => {
            form.append("files", file);
          });
        } else {
          form.append("files", files, (files as any).name);
        }

        if (metadata) {
          form.append("metadata", JSON.stringify(metadata));
        }
        return marketplaceApi.post(API_ENDPOINTS.UPLOAD_IMAGE, form);
      },

      uploadMetadata: (
        data: Record<string, any>
      ): Promise<APIResponse.UploadMetadata> => {
        const form = new FormData();
        form.append("metadata", JSON.stringify(data));
        return marketplaceApi.post(API_ENDPOINTS.UPLOAD_IMAGE, form);
      },

      createCollection: (params: APIParams.CreateCollection) =>
        marketplaceApi.post(API_ENDPOINTS.COLLECTIONS, params, authHeader()),

      updateCollection: ({ coverImage, id }: APIParams.UpdateCollection) =>
        marketplaceApi.put(
          API_ENDPOINTS.COLLECTIONS + `/${id}`,
          { coverImage },
          authHeader()
        ),

      createNFT: async (
        params: APIParams.CreateNFT
      ): Promise<APIResponse.CreateNFT | void> => {
        const response = await handleAuthentication();
        const axiosClient = getMarketplaceApi();

        if (response.status === "fail") {
          clearAuthCookiesAction();
          clearProfile();
          return router.push("/");
        }

        axiosClient.defaults.headers.common.Authorization =
          response.bearerToken;
        return axiosClient.post(API_ENDPOINTS.NFT, params);
      },

      fetchNFTs: (
        params: APIParams.FetchNFTs
      ): Promise<APIResponse.FetchNFTs> => {
        const { priceMin, priceMax, quoteToken } = params;
        const bigintMin =
          priceMin !== undefined ? parseUnits(priceMin, 18) : undefined;
        const bigintMax =
          priceMax !== undefined ? parseUnits(priceMax, 18) : undefined;
        return marketplaceApi.post(
          API_ENDPOINTS.SEARCH_NFT,
          sanitizeObject({
            ...params,
            sellStatus:
              Number(priceMin) || Number(priceMax)
                ? "AskNew"
                : params.sellStatus,
            priceMin: bigintMin?.toString(),
            priceMax: bigintMax?.toString(),
          })
        );
      },

      fetchNFTEvents: (
        params: APIParams.NFTEvents
      ): Promise<APIResponse.NFTEvents> =>
        marketplaceApi.post(API_ENDPOINTS.NFT_EVENTS, params),

      fetchUserActivities: (
        params: APIParams.UserActivities
      ): Promise<APIResponse.UserActivities> =>
        marketplaceApi.post(API_ENDPOINTS.USER_ACTIVITIES, params),

      validateInput: (params: APIParams.ValidateInput): Promise<boolean> =>
        marketplaceApi.post(API_ENDPOINTS.VALIDATE_INPUT, params),

      /** GET **/
      fetchCollections: (
        params: APIParams.FetchCollections
      ): Promise<APIResponse.FetchCollections> => {
        const { min, max } = params;
        const bigintMin = min !== undefined ? parseUnits(min, 18) : undefined;
        const bigintMax = max !== undefined ? parseUnits(max, 18) : undefined;
        return marketplaceApi.get(
          API_ENDPOINTS.COLLECTIONS +
            parseQueries(
              sanitizeObject({
                ...params,
                min: bigintMin?.toString(),
                max: bigintMax?.toString(),
              })
            )
        );
      },

      fetchCollectionById: (
        id: string | Address
      ): Promise<APIResponse.CollectionDetails> =>
        marketplaceApi.get(API_ENDPOINTS.COLLECTIONS + `/${id}`),

      fetchCollectionsByUser: async ({
        userId,
        ...rest
      }: APIParams.FetchCollectionById): Promise<APIResponse.FetchCollections> => {
        return marketplaceApi.get(
          API_ENDPOINTS.USER_COLLECTIONS + `/${userId}` + parseQueries(rest)
        );
      },

      generateTokenId: async (
        collectionAddress: Address
      ): Promise<APIResponse.GenerateTokenId> =>
        marketplaceApi.get(
          API_ENDPOINTS.TOKEN_ID + `?collectionAddress=${collectionAddress}`,
          authHeader()
        ),

      fetchNFTById: (
        params: APIParams.FetchNFTDetails
      ): Promise<APIResponse.NFTDetails> => {
        return marketplaceApi.get(API_ENDPOINTS.NFT + parseQueries(params));
      },

      fetchMarketDataByNFT: (
        params: APIParams.FetchNFTMarketData
      ): Promise<APIResponse.NFTMarketData> =>
        marketplaceApi.get(
          API_ENDPOINTS.NFT_TRANSACTIONS + parseQueries(params)
        ),

      getNFTMetaData: (
        ifpsUrl: string
      ): Promise<APIResponse.FetchNFTMetadata> => {
        return marketplaceApi.get(
          API_ENDPOINTS.GET_METADATA + `?ipfsPath=${ifpsUrl}`
        );
      },

      viewProfile: async (
        id: Address | string
      ): Promise<APIResponse.ProfileDetails | void> => {
        return marketplaceApi.get(
          API_ENDPOINTS.PROFILE + `/${id}`,
          authHeader()
        );
      },

      fetchUsers: async (
        params: APIParams.FetchUsers
      ): Promise<APIResponse.UsersData> =>
        marketplaceApi.get(
          API_ENDPOINTS.USER + parseQueries(params),
          authHeader()
        ),

      verifyAccount: (): Promise<APIResponse.VerifyAccount> =>
        marketplaceApi.post(API_ENDPOINTS.LIST_VERIFY, {}, authHeader()),

      fetchEmailVerify: async (
        params: APIParams.FetchEmailVerify
      ): Promise<APIResponse.FetchEmailVerify | void> => {
        const response = await handleAuthentication();
        const axiosClient = getMarketplaceApi();
        if (response.status === "fail") {
          clearAuthCookiesAction();
          clearProfile();
          return router.push("/");
        }
        axiosClient.defaults.headers.common.Authorization =
          response.bearerToken;
        return axiosClient.post(
          API_ENDPOINTS.VERIFY_EMAIL,
          params,
          authHeader()
        );
      },
      followUser: async ({
        userId,
        accessToken,
      }: APIParams.FollowUser): Promise<APIResponse.FollowUser | void> => {
        const response = await handleAuthentication();
        const axiosClient = getMarketplaceApi();

        if (response.status === "fail") {
          clearAuthCookiesAction();
          clearProfile();
          return router.push("/");
        }

        axiosClient.defaults.headers.common.Authorization =
          response.bearerToken;
        return axiosClient.post(API_ENDPOINTS.FOLLOW + `/${userId}`, {});
      },
      getTotalCountById: (params: APIParams.CountNumber): Promise<number> =>
        marketplaceApi.post(API_ENDPOINTS.TOTAL_COUNT, params),
      getFloorPrice: (params: {
        address: Address | string;
      }): Promise<APIResponse.FloorPrice> => {
        const requestData = {
          address: params.address,
        };
        return marketplaceApi.post(
          API_ENDPOINTS.FLOOR_PRICE,
          requestData,
          authHeader()
        );
      },
    };
  }, [authHeader]);
};
