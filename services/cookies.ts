import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { APIResponse } from './api/types';

export const setAuthCookies = ({
  accessToken,
  accessTokenExpire,
  refreshToken,
  refreshTokenExpire,
  userId,
}: APIResponse.Connect) => {
  cookies().set('accessToken', accessToken, {
    expires: accessTokenExpire,
  });
  cookies().set('refreshToken', refreshToken, {
    expires: refreshTokenExpire,
  });
  cookies().set('userId', userId, {
    expires: accessTokenExpire,
  });
};

export const getAuthCookies = () => {
  return {
    accessToken: getCookie('accessToken')?.toString(),
    refreshToken: getCookie('refreshToken')?.toString(),
  };
};

export const clearAuthCookies = () => {
  cookies().delete('accessToken');
  cookies().delete('refreshToken');
  cookies().delete('userId');
};
