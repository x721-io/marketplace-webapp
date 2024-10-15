import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import Providers from "@/components/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import React, { Suspense } from "react";
import LoadingPage from "./loading";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import ThemeProvider from "./theme-provider";
import AuthProvider from "./auth-provider";

export const metadata: Metadata = {
  title: "X721 Marketplace",
  description: "X721 Marketplace",
};

const font = Inter({
  weight: ['100','200','300', '400','500','600','700','800','900'],
  subsets: ['latin'],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={font.className}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundary>
              <Providers>
                <AuthProvider>
                  <Suspense fallback={<LoadingPage />}>{children}</Suspense>
                  <ToastContainer autoClose={5000} />
                </AuthProvider>
              </Providers>
            </ErrorBoundary>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
