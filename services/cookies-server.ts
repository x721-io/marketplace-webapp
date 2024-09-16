import { cookies } from "next/headers";
import { APIResponse } from "./api/types";
import { MARKETPLACE_URL } from "@/config/constants";

export const setAuthCookies = ({
  accessToken,
  accessTokenExpire,
  refreshToken,
  refreshTokenExpire,
  userId,
}: APIResponse.Connect) => {
  cookies().set("accessToken", accessToken, {
    expires: accessTokenExpire,
    domain: MARKETPLACE_URL,
  });
  cookies().set("refreshToken", refreshToken, {
    expires: refreshTokenExpire,
    domain: MARKETPLACE_URL,
  });
  cookies().set("userId", userId, {
    expires: accessTokenExpire,
    domain: MARKETPLACE_URL,
  });
};

export const getAuthCookies = () => {
  return {
    accessToken: cookies().get("accessToken")?.value,
    refreshToken: cookies().get("refreshToken")?.value,
  };
};

export const clearAuthCookies = () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
  cookies().delete("userId");
};
