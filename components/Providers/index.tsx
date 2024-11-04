"use client";

import React from "react";
import { config as wagmiConfig } from "@/config/wagmi";
import { Flowbite } from "flowbite-react";
import appTheme from "@/config/flowbite";
import { SWRConfig } from "swr";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          refreshInterval: 0,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Flowbite theme={{ theme: appTheme }}>{children}</Flowbite>
          </RainbowKitProvider>
        </QueryClientProvider>
      </SWRConfig>
    </WagmiProvider>
  );
}
