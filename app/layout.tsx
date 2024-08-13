import type { Metadata } from 'next';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';
import Providers from '@/components/Providers';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import React, { Suspense } from 'react';
import LoadingPage from './loading';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import ThemeProvider from './theme-provider';

export const metadata: Metadata = {
  title: 'X721 Marketplace',
  description: 'X721 Marketplace',
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
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundary>
              <Providers>
                <Suspense fallback={<LoadingPage />}>{children}</Suspense>
                <ToastContainer autoClose={5000} />
              </Providers>
            </ErrorBoundary>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
