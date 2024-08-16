"use server";

import { APIResponse } from "@/services/api/types";
import {
  clearAuthCookies,
  getAuthCookies,
  setAuthCookies,
} from "@/services/cookies-server";

// import { API_ENDPOINTS } from '@/config/api';
// import { marketplaceApi } from '@/services/api';
// import { clearAuthCookies } from '@/services/cookies-client';
// import { getAuthCookies } from '@/services/cookies-server';
// import { Axios } from 'axios';
// import { getTranslations } from 'next-intl/server';

export const setAuthCookiesAction = async ({
  accessToken,
  accessTokenExpire,
  refreshToken,
  refreshTokenExpire,
  userId,
}: APIResponse.Connect) => {
  setAuthCookies({
    accessToken,
    accessTokenExpire,
    refreshToken,
    refreshTokenExpire,
    userId,
  });
};

export const getAuthCookiesAction = async () => {
  getAuthCookies();
};

export const clearAuthCookiesAction = async () => {
  clearAuthCookies();
};

// export const handleRouteAuthentication = async (
//   request: Request,
//   client: Axios,
// ) => {
//   const url = new URL(request.url);
//   if (url.pathname === API_ENDPOINTS.CONNECT) {
//     return;
//   }
//   const { accessToken, refreshToken } = getAuthCookies();

//   // console.log('accessToken', accessToken);
//   // console.log('refreshToken', refreshToken);
//   // Handle Access token expires
//   if (!accessToken) {
//     if (!refreshToken) {
//       clearAuthCookies();
//     } else {
//       try {
//         const credentials: Credential = await marketplaceApi.post(
//           API_ENDPOINTS.REFRESH,
//           {
//             refresh_token: refreshToken,
//           },
//         );
//         console.log('--------');
//         console.log('TOKEN REFRESHED');
//         console.log('NEW TOKEN', credentials);
//         console.log('--------');

//         setAuthCookies(credentials);

//         client.defaults.headers.common.Authorization = `Bearer ${credentials.accessToken}`;
//       } catch (e: any) {
//         console.log('--------');
//         console.log('ERROR REFRESHING', e.message);
//         console.log('--------');

//         clearAuthCookies();
//       }
//     }
//   } else {
//     client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//   }
// };

// export const parseRequestParams = async (request: Request) => {
//   const url = new URL(request.url);
//   let params;

//   try {
//     if (request.method === 'GET') {
//       params = null;
//     } else if (
//       request.headers.get('Content-Type')?.includes('multipart/form-data')
//     ) {
//       params = await request.formData();
//     } else {
//       params = await request.json();
//     }
//   } catch (e: any) {
//     params = {};
//     console.log('Error transforming params:', e.message);
//   }

//   return { url: url.pathname + url.search, params, pathname: url.pathname };
// };

// export const translateApiMessages = async (
//   pathname: string,
//   type: 'error' | 'success',
// ) => {
//   const t = await getTranslations('api');
//   const [translationKey] =
//     Object.entries(CLIENT_ENDPOINTS).find(([, endpoint]) => {
//       return pathname === '/api' + endpoint;
//     }) || [];

//   return t(type, {
//     action: translationKey?.split('_').join(' ') || 'Perform Request',
//   });
// };
