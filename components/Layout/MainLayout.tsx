"use client";

import MainHeader from "@/components/Layout/MainHeader";
import MainFooter from "@/components/Layout/MainFooter";
import MainBody from "@/components/Layout/MainBody";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setClient] = useState(false);

  useEffect(() => setClient(true), []);

  if (!isClient) return null;

  return (
    <main className="flex flex-col min-h-screen">
      <MainHeader />
      <MainBody>{children}</MainBody>
      <MainFooter />
    </main>
  );
}
