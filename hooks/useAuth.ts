"use client";

import { Address, useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { disconnect } from "@wagmi/core";
import { sleep } from "@/utils";
import useAuthStore, { clearProfile } from "@/store/auth/store";
import { useCallback, useContext, useMemo } from "react";
import { APIParams } from "@/services/api/types";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { CHAIN_ID } from "@/config/constants";
import { AuthenticationContext } from "@/app/auth-provider";
import { clearAuthCookiesAction, setAuthCookiesAction } from "@/actions";

export const useAuth = () => {
  const api = useMarketplaceApi();
  const { isAuthenticated, credentials } = useContext(AuthenticationContext);
  const { setProfile } = useAuthStore();
  const bearerToken = credentials?.accessToken;
  const { isConnected, address } = useAccount();
  const acceptedTerms = useAuthStore((state) => state.profile?.acceptedTerms);
  const userWallet = useAuthStore((state) => state.profile?.publicKey);

  const isCorrectWallet = useMemo(() => {
    if (!userWallet || !address) return false;
    return userWallet.toLowerCase() === address.toLowerCase();
  }, [userWallet, address, isConnected]);

  const isValidSession = useMemo(() => {
    let isValid = false;
    if (isAuthenticated) {
      isValid = (isAuthenticated && acceptedTerms && isCorrectWallet) ?? false;
    } else {
      isValid = (acceptedTerms && isCorrectWallet) ?? false;
    }
    if (!isValid) {
      localStorage.removeItem("auth-storage");
    }
    return isValid;
  }, [isAuthenticated, acceptedTerms, isCorrectWallet]);

  // if (typeof localStorage !== "undefined") {
  //   if (!isValidSession) {
  //     localStorage.removeItem("auth-storage");
  //   }
  // }

  const onAuth = useCallback(
    async (date: string, message: Address) => {
      if (!address) return;

      const credentials = await api.connect({
        date,
        publicKey: address,
        signature: message,
        signer: address.toLocaleLowerCase(),
      });
      setAuthCookiesAction(credentials);
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
    clearAuthCookiesAction();
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
