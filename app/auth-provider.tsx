"use client";

import { clearAuthCookiesAction } from "@/actions";
import { APIResponse } from "@/services/api/types";
import useAuthStore, { clearProfile } from "@/store/auth/store";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import useSWR from "swr";
export type AuthenticationCtxType = {
  isAuthenticated: boolean;
  credentials: APIResponse.Connect | null;
};

export const AuthenticationContext = createContext<AuthenticationCtxType>({
  isAuthenticated: false,
  credentials: null,
});

const authenticate = async () => {
  const authRes = await axios.post("/api/auth/refresh");
  return authRes.data;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setProfile } = useAuthStore();
  const [isAuthenticated, setAuthenticated] = useState(false);
  const { data, isLoading } = useSWR("/api/auth/refresh", authenticate);
  const [credentials, setCredentials] = useState<APIResponse.Connect | null>(
    null
  );

  useEffect(() => {
    if (!isLoading && data) {
      if (data.status === 200) {
        setProfile(data.profile);
        setCredentials(data.credentials);
        setAuthenticated(true);
      } else {
        clearAuthCookiesAction();
        clearProfile();
      }
    }
  }, [data, !isLoading]);

  if (isLoading) return null;

  return (
    <AuthenticationContext.Provider value={{ isAuthenticated, credentials }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
