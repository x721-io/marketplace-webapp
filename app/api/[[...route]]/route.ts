import {
  handleAuthentication,
  handleRouteAuthentication,
  parseRequestParams,
  translateApiMessages,
} from "@/actions";
import { getBackendAPI, marketplaceApi } from "@/services/api";

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '20mb',
//     },
//   },
// };

export async function GET(request: Request) {
  const backendAPI = marketplaceApi;
  await handleRouteAuthentication(request, backendAPI);
  const { url, pathname } = await parseRequestParams(request);

  try {
    const data = await backendAPI.get(url);
    return Response.json(
      { data, message: await translateApiMessages(pathname, "success") },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    return Response.json(
      {
        error: e.message,
        message: await translateApiMessages(pathname, "error"),
      },
      { status: e.statusCode }
    );
  }
}

export async function POST(request: Request) {
  const backendAPI = getBackendAPI();
  await handleRouteAuthentication(request, backendAPI);
  const { url, params, pathname } = await parseRequestParams(request);

  try {
    const data = await backendAPI.post(url, params);
    return Response.json(
      { data, message: await translateApiMessages(pathname, "success") },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    console.log(url, e);
    return Response.json(
      {
        error: e.message,
        message: await translateApiMessages(pathname, "error"),
      },
      { status: e.statusCode }
    );
  }
}

export async function PUT(request: Request) {
  const backendAPI = getBackendAPI();
  await handleRouteAuthentication(request, backendAPI);
  const { url, params, pathname } = await parseRequestParams(request);

  try {
    const data = await backendAPI.put(url, params);
    return Response.json(
      { data, message: await translateApiMessages(pathname, "success") },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    console.log(url, e);
    return Response.json(
      {
        error: e.message,
        message: await translateApiMessages(pathname, "error"),
      },
      { status: e.statusCode }
    );
  }
}
