import { API_ENDPOINTS } from "@/config/api";
import { marketplaceApi } from "@/services/api";
import { APIParams } from "@/services/api/types";
import { getAuthCookies } from "@/services/cookies-server";
import { parseQueries } from "@/utils";
import { HttpStatusCode } from "axios";

export async function GET(
  req: Request,
  { params }: { params: APIParams.FetchUsers }
) {
  const credentials = getAuthCookies();
  const baseApi = marketplaceApi;

  if (credentials.accessToken) {
    baseApi.defaults.headers.common.Authorization = `Bearer ${credentials.accessToken}`;
  }
  try {
    const url = new URL(req.url);
    const data = await baseApi.get(API_ENDPOINTS.USER + url.search);
    return Response.json(data, {
      status: 200,
    });
  } catch (err: any) {
    return Response.json(
      { message: "error" },
      {
        status: HttpStatusCode.InternalServerError,
      }
    );
  }
}
