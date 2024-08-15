import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { APIResponse } from "./api/types";

export const setAuthCookies = ({
  accessToken,
  accessTokenExpire,
  refreshToken,
  refreshTokenExpire,
  userId,
}: APIResponse.Connect) => {
  setCookie("accessToken", accessToken, {
    maxAge: accessTokenExpire,
  });
  setCookie("refreshToken", refreshToken, {
    maxAge: refreshTokenExpire,
  });
  setCookie("userId", userId, {
    maxAge: accessTokenExpire,
  });
};

export const getAuthCookies = () => {
  return {
    accessToken: getCookie("accessToken")?.toString(),
    refreshToken: getCookie("refreshToken")?.toString(),
    userId: getCookie("userId")?.toString(),
  };
};

export const clearAuthCookies = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  deleteCookie("userId");
};
