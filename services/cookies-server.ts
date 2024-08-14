import { cookies } from 'next/headers';
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
    accessToken: cookies().get('accessToken')?.value,
    refreshToken: cookies().get('refreshToken')?.value,
  };
};

export const clearAuthCookies = () => {
  cookies().delete('accessToken');
  cookies().delete('refreshToken');
  cookies().delete('userId');
};
