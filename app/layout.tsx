import type { Metadata } from 'next'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css'
import Providers from '@/components/Providers'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ToastContainer } from 'react-toastify'
import React from 'react'

export const metadata: Metadata = {
  title: 'U2U NFT Marketplace',
  description: 'U2U NFT Marketplace'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body>
    <ErrorBoundary>
      <Providers>
        {children}
        <ToastContainer autoClose={5000} />
      </Providers>
    </ErrorBoundary>
    </body>
    </html>
  )
}
