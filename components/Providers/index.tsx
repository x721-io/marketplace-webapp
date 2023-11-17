"use client"

import { wagmiConfig } from "@/config/wagmi";
import { WagmiConfig } from "wagmi";
import { Flowbite } from 'flowbite-react'
import { appTheme } from '@/config/flowbite'

export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <WagmiConfig config={wagmiConfig}>
      <Flowbite theme={{ theme: appTheme }}>
        {children}
      </Flowbite>
    </WagmiConfig>
  );
}
