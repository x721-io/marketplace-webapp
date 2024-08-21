"use server";

import { getTranslations } from "next-intl/server";
import { APIResponse } from "@/services/api/types";
import {
  clearAuthCookies,
  getAuthCookies,
  setAuthCookies,
} from "@/services/cookies-server";

import { API_ENDPOINTS } from "@/config/api";
// import { marketplaceApi } from '@/services/api';
// import { clearAuthCookies } from '@/services/cookies-client';
// import { getAuthCookies } from '@/services/cookies-server';
import {
  Axios,
  AxiosHeaders,
  AxiosHeaderValue,
  AxiosInstance,
  HeadersDefaults,
} from "axios";
import { getMarketplaceApi, marketplaceApi } from "@/services/api";
// import { getTranslations } from 'next-intl/server';

export const setAuthCookiesAction = async ({
  accessToken,
  accessTokenExpire,
  refreshToken,
  refreshTokenExpire,
  userId,
}: APIResponse.Connect) => {
  setAuthCookies({
    accessToken,
    accessTokenExpire,
    refreshToken,
    refreshTokenExpire,
    userId,
  });
};

export const getAuthCookiesAction = async () => {
  return getAuthCookies();
};

export const clearAuthCookiesAction = async () => {
  clearAuthCookies();
};

export const handleAuthentication = async (): Promise<
  | {
      status: "success";
      bearerToken: string;
    }
  | { status: "fail"; error: string }
> => {
  const { accessToken, refreshToken } = getAuthCookies();
  if (!accessToken) {
    if (!refreshToken) {
      clearAuthCookies();
      return { status: "fail", error: "Token expired" };
    } else {
      try {
        const credentials: APIResponse.Connect = await marketplaceApi.post(
          API_ENDPOINTS.REFRESH,
          {
            refresh_token: getAuthCookies().refreshToken,
          }
        );
        console.log("--------");
        console.log("TOKEN REFRESHED");
        console.log("NEW TOKEN", credentials);
        console.log("--------");

        const {
          accessToken,
          accessTokenExpire,
          refreshToken,
          refreshTokenExpire,
          userId,
        } = credentials;

        setAuthCookies({
          accessToken,
          accessTokenExpire,
          refreshToken,
          refreshTokenExpire,
          userId,
        });
        return { status: "success", bearerToken: `Bearer ${accessToken}` };
      } catch (e: any) {
        console.log("--------");
        console.log("ERROR REFRESHING", e.message);
        console.log("--------");
        clearAuthCookies();
        return { status: "fail", error: "Token expired" };
      }
    }
  } else {
    return { status: "success", bearerToken: `Bearer ${accessToken}` };
  }
};

export const parseRequestParams = async (request: Request) => {
  const url = new URL(request.url);
  let params;

  try {
    if (request.method === "GET") {
      params = null;
    } else if (
      request.headers.get("Content-Type")?.includes("multipart/form-data")
    ) {
      params = await request.formData();
    } else {
      params = await request.json();
    }
  } catch (e: any) {
    params = {};
    console.log("Error transforming params:", e.message);
  }

  return { url: url.pathname + url.search, params, pathname: url.pathname };
};

export const translateApiMessages = async (
  pathname: string,
  type: "error" | "success"
) => {
  const t = await getTranslations("api");
  const [translationKey] =
    Object.entries(API_ENDPOINTS).find(([, endpoint]) => {
      return pathname === "/api" + endpoint;
    }) || [];

  return t(type, {
    action: translationKey?.split("_").join(" ") || "Perform Request",
  });
};
