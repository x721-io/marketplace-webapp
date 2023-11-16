import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css'
import MainLayout from "@/components/Layout/MainLayout";
import Providers from '@/components/Providers'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ToastContainer } from 'react-toastify'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'U2U NFT Marketplace',
  description: 'U2U NFT Marketplace'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <ErrorBoundary>
      <Providers>
        {children}
        <ToastContainer />
      </Providers>
    </ErrorBoundary>
    </body>
    </html>
  )
}
