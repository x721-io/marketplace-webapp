import { API_ENDPOINTS } from "@/config/api";
import { getBackendAPI } from "@/services/api";
import { APIResponse } from "@/services/api/types";
import { setAuthCookies } from "@/services/cookies-server";

export async function POST(request: Request) {
  const backendAPI = getBackendAPI();

  try {
    const params = await request.json();
    const credentials = (await backendAPI.post(
      API_ENDPOINTS.CONNECT,
      params
    )) as APIResponse.Connect;

    setAuthCookies(credentials);

    return Response.json(
      { data: credentials, message: "Connect wallet successfully" },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
