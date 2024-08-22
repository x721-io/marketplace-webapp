import { API_ENDPOINTS } from "@/config/api";
import { getBackendAPI } from "@/services/api";
import { APIResponse } from "@/services/api/types";
import {
  clearAuthCookies,
  getAuthCookies,
  setAuthCookies,
} from "@/services/cookies-server";
import { HttpStatusCode } from "axios";

export async function POST(request: Request) {
  const backendAPI = getBackendAPI();
  const credentials = getAuthCookies();
  if (credentials.refreshToken) {
    try {
      const bodyData = {
        refresh_token: credentials.refreshToken,
      };
      const data: APIResponse.Connect = await backendAPI.post(
        API_ENDPOINTS.REFRESH,
        bodyData
      );
      const token = `Bearer ${data.accessToken}`;
      const profile: APIResponse.ProfileDetails = await backendAPI.get(
        API_ENDPOINTS.PROFILE + `/${data.userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAuthCookies(data);
      return Response.json({
        status: HttpStatusCode.Ok,
        credentials: data,
        profile,
      });
    } catch (e: any) {
      console.log(e);
      clearAuthCookies();
      return Response.json({
        status: HttpStatusCode.Unauthorized,
      });
    }
  } else {
    return Response.json({
      status: HttpStatusCode.Unauthorized,
    });
  }
}
