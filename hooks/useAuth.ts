"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { hasCookie } from "cookies-next";
import { disconnect } from "@wagmi/core";
import { sleep } from "@/utils";
import useAuthStore, { clearProfile } from "@/store/auth/store";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { APIParams } from "@/services/api/types";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { CHAIN_ID } from "@/config/constants";
import { AuthenticationContext } from "@/app/auth-provider";
import { clearAuthCookiesAction, setAuthCookiesAction } from "@/actions";
import { useConnectAPI } from "./useMutate";
import { Address } from "abitype";
import { config } from "@/config/wagmi";

export const useAuth = () => {
  const api = useMarketplaceApi();
  const { isAuthenticated, credentials } = useContext(AuthenticationContext);
  const { setProfile } = useAuthStore();
  const bearerToken = credentials?.accessToken;
  const { isConnected, address } = useAccount();
  const acceptedTerms = useAuthStore((state) => state.profile?.acceptedTerms);
  const userWallet = useAuthStore((state) => state.profile?.publicKey);
  const { trigger: connectAPIMutate } = useConnectAPI();

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
      const credentials = await connectAPIMutate({
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
      if (!hasCookie("refreshToken")) {
        throw new Error("User not authorized. Please connect wallet again");
      }
      const resonse = await api.updateProfile(params);
      if (!resonse) return;
      setProfile(resonse.data.data);
    },
    [bearerToken, setProfile]
  );

  const onVerifyAccount = useCallback(async () => {
    if (!bearerToken) return;
    return api.verifyAccount();
  }, [bearerToken]);

  const onResendEmail = useCallback(
    async (params: APIParams.ResendVerifyMail) => {
      if (!bearerToken) return;
      const email = await api.resendEmail(params);
    },
    [bearerToken, address]
  );

  const onLogout = async () => {
    await disconnect(config);
    clearAuthCookiesAction();
    clearProfile();
    window.location.reload();
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
  const { chainId, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    if (chainId === Number(CHAIN_ID)) {
      setIsWrongNetwork(false);
    } else {
      setIsWrongNetwork(true);
    }
  }, [chainId, isConnected]);

  const switchToCorrectNetwork = () => {
    if (isWrongNetwork) {
      switchChain({ chainId: Number(CHAIN_ID) });
    }
  };

  return { isWrongNetwork, switchToCorrectNetwork };
};
