import { API_ENDPOINTS } from "@/config/api";
import { marketplaceApi } from "@/services/api";
import { APIParams } from "@/services/api/types";
import { parseQueries } from "@/utils";
import { HttpStatusCode } from "axios";

export async function POST(
  req: Request,
  { params }: { params: APIParams.FetchNFTs }
) {
  const baseApi = marketplaceApi;
  try {
    const body = await req.json();
    const data = await baseApi.post(API_ENDPOINTS.SEARCH_NFT, body);
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
