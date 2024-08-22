import { API_ENDPOINTS } from "@/config/api";
import { marketplaceApi } from "@/services/api";
import { APIParams } from "@/services/api/types";
import { parseQueries } from "@/utils";
import { HttpStatusCode } from "axios";

export async function GET(
  req: Request,
  { params }: { params: APIParams.FetchUsers }
) {
  const baseApi = marketplaceApi;
  try {
    const url = new URL(req.url);
    const data = await baseApi.get(API_ENDPOINTS.COLLECTIONS + url.search);
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
