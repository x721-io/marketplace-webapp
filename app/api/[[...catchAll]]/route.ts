import { getMarketplaceApi } from '@/services/api';
import {
  handleRouteAuthentication,
  parseRequestParams,
  translateApiMessages,
} from '@/actions';

export async function GET(request: Request) {
  const marketplaceAPI = getMarketplaceApi();
  await handleRouteAuthentication(request, marketplaceAPI);
  const { url, pathname } = await parseRequestParams(request);

  try {
    const data = await marketplaceAPI.get(url);
    return Response.json(
      { data, message: await translateApiMessages(pathname, 'success') },
      {
        status: 200,
      },
    );
  } catch (e: any) {
    console.log(url, e);
    return Response.json(
      {
        error: e.message,
        message: await translateApiMessages(pathname, 'error'),
      },
      { status: e.statusCode },
    );
  }
}

export async function POST(request: Request) {
  const marketplaceAPI = getMarketplaceApi();
  await handleRouteAuthentication(request, marketplaceAPI);
  const { url, params, pathname } = await parseRequestParams(request);

  try {
    const data = await marketplaceAPI.post(url, params);
    return Response.json(
      { data, message: await translateApiMessages(pathname, 'success') },
      {
        status: 200,
      },
    );
  } catch (e: any) {
    console.log(url, e);
    return Response.json(
      {
        error: e.message,
        message: await translateApiMessages(pathname, 'error'),
      },
      { status: e.statusCode },
    );
  }
}

export async function PUT(request: Request) {
  const marketplaceAPI = getMarketplaceApi();
  await handleRouteAuthentication(request, marketplaceAPI);
  const { url, params, pathname } = await parseRequestParams(request);

  try {
    const data = await marketplaceAPI.put(url, params);
    return Response.json(
      { data, message: await translateApiMessages(pathname, 'success') },
      {
        status: 200,
      },
    );
  } catch (e: any) {
    console.log(url, e);
    return Response.json(
      {
        error: e.message,
        message: await translateApiMessages(pathname, 'error'),
      },
      { status: e.statusCode },
    );
  }
}
