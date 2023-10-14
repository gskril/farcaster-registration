import '@rainbow-me/rainbowkit/styles.css'
import type { Metadata } from 'next'

import { ClientProviders } from '@/lib/providers'

import './globals.css'

export const metadata: Metadata = {
  title: 'Register for Farcaster',
  description: 'Create a Farcaster account on OP Mainnet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ClientProviders>
          <div className="flex flex-col justify-center items-center p-6 min-h-screen w-full max-w-xl my-0 mx-auto">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
