'use client'

import { Address, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { disconnect } from '@wagmi/core';
import { sleep } from '@/utils';
import useAuthStore, { clearProfile } from '@/store/auth/store';
import { useCallback, useMemo } from 'react';
import { APIParams } from '@/services/api/types';
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';
import { CHAIN_ID } from '@/config/constants';
import {  setAuthCookies, getAuthCookies, clearAuthCookies } from '@/services/cookies-client';

export const useAuth = () => {
  const api = useMarketplaceApi();
  const { setProfile } = useAuthStore();
  const credentials = getAuthCookies();
  const bearerToken = credentials?.accessToken;

  const { isConnected, address } = useAccount();
  const acceptedTerms = useAuthStore((state) => state.profile?.acceptedTerms);
  const accessToken = credentials.accessToken;
  const userWallet = useAuthStore((state) => state.profile?.publicKey);

  const isCorrectWallet = useMemo(() => {
    if (!userWallet || !address) return false;
    return userWallet.toLowerCase() === address.toLowerCase();
  }, [userWallet, address, isConnected]);


  const isValidSession = useMemo(() => {
    const credentials = getAuthCookies();
    const accessToken = credentials?.accessToken
    return acceptedTerms && !!accessToken && isCorrectWallet;
  }, [acceptedTerms, accessToken, isCorrectWallet]);

  if (typeof localStorage !== 'undefined') {
    if (!isValidSession) {
      localStorage.removeItem('auth-storage');
    }
  }

  const onAuth = useCallback(
    async (date: string, message: Address) => {
      if (!address) return;

      const credentials = await api.connect({
        date,
        publicKey: address,
        signature: message,
        signer: address.toLocaleLowerCase(),
      });
      setAuthCookies(credentials);
      await sleep(1000);
      return credentials;
    },
    [address]
  );

  const onUpdateProfile = useCallback(
    async (params: APIParams.UpdateProfile) => {
      if (!bearerToken) return;
      const profile = await api.updateProfile(params);
      setProfile(profile);
    },
    [bearerToken, address]
  );

  const onVerifyAccount = useCallback(async () => {
    if (!bearerToken) return;
    return api.verifyAccount();
  }, [bearerToken, address]);

  const onResendEmail = useCallback(
    async (params: APIParams.ResendVerifyMail) => {
      if (!bearerToken) return;
      const email = await api.resendEmail(params);
    },
    [bearerToken, address]
  );

  const onLogout = async () => {
    await disconnect();
    clearAuthCookies()
    clearProfile();
  };

  return {
    isValidSession,
    onAuth,
    onUpdateProfile,
    bearerToken,
    onLogout,
    onResendEmail,
    onVerifyAccount,
  };
};

export const useWrongNetwork = () => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const isWrongNetwork = useMemo(() => {
    return !!chain?.id && chain?.id !== Number(CHAIN_ID);
  }, [chain?.id]);

  const switchToCorrectNetwork = () => {
    if (isWrongNetwork) {
      switchNetwork?.(Number(CHAIN_ID));
    }
  };

  return { isWrongNetwork, switchToCorrectNetwork };
};
