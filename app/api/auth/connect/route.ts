import { getMarketplaceApi } from '@/services/api';
import { API_ENDPOINTS } from '@/config/api';
import { setAuthCookies } from '@/services/cookies';
import { APIResponse } from '@/services/api/types';

export async function POST(request: Request) {
  const marketplaceAPI = getMarketplaceApi();

  try {
    const params = await request.json();
    const credentials = (await marketplaceAPI.post(
      API_ENDPOINTS.CONNECT,
      params,
    )) as APIResponse.Connect;
    

    setAuthCookies(credentials);

    return Response.json(
      { data: credentials, message: 'Connect wallet successfully' },
      {
        status: 200,
      },
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
