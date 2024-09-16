import { cookies } from "next/headers";
import { APIResponse } from "./api/types";

export const setAuthCookies = ({
  accessToken,
  accessTokenExpire,
  refreshToken,
  refreshTokenExpire,
  userId,
}: APIResponse.Connect) => {
  console.log("ACCESS_TOKEN:");
  console.log(accessToken);
  console.log(accessTokenExpire);
  cookies().set("accessToken", accessToken, {
    expires: accessTokenExpire,
    sameSite: "none",
    path: "/",
  });
  cookies().set("refreshToken", refreshToken, {
    expires: refreshTokenExpire,
    sameSite: "none",
    path: "/",
  });
  console.log("REFRESH_TOKEN:");
  console.log(refreshToken);
  console.log(refreshTokenExpire);
  cookies().set("userId", userId, {
    expires: accessTokenExpire,
    sameSite: "none",
    path: "/",
  });
  console.log("USER_ID:");
  console.log(userId);
  console.log(accessTokenExpire);
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
