import { API_ENDPOINTS } from "@/config/api";
import { marketplaceApi } from "@/services/api";
import { getAuthCookies } from "@/services/cookies-server";
import { HttpStatusCode } from "axios";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const credentials = getAuthCookies();
  const baseApi = marketplaceApi;

  if (credentials.accessToken) {
    baseApi.defaults.headers.common.Authorization = `Bearer ${credentials.accessToken}`;
  }
  try {
    const data = await baseApi.get(API_ENDPOINTS.PROFILE + `/${id}`);
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
