import type { Metadata } from "next";
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
import { headData } from "@/config/constants";

export const metadata: Metadata = {
  title: {
    template: `%s | ${headData.title}`,
    default: headData.title,
  },
  description: headData.description,
  openGraph: {
    title: headData.title,
    description: headData.description,
    type: "website",
    url: `${headData.mainDomain}/`,
    siteName: headData.title,
    images: [
      {
        url: `${headData.mainDomain}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: headData.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: headData.title,
    images: [
      {
        url: `${headData.mainDomain}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: headData.title,
      },
    ],
    description: headData.description,
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        <title>{headData.title}</title>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="canonical" href={headData.mainDomain} />
        <meta name="apple-mobile-web-app-title" content="X721 Marketplace" />
      </head>
      <body>
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
