import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import Providers from "@/components/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import React, { Suspense } from "react";
import LoadingPage from "./loading";
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: "X721 Marketplace",
  description: "X721 Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Providers>
            <Suspense fallback={<LoadingPage />}>{children}</Suspense>
            <ToastContainer autoClose={5000} />
          </Providers>
        </ErrorBoundary>
        <GoogleAnalytics gaId="G-4BKP4Z6M3K" />
      </body>
    </html>
  );
}
