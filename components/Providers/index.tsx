"use client"

import React from "react";
import { wagmiConfig } from "@/config/wagmi";
import { WagmiConfig } from "wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <WagmiConfig config={wagmiConfig}>
      {children}
    </WagmiConfig>
  );
}
