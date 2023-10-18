import '@rainbow-me/rainbowkit/styles.css'
import type { Metadata } from 'next'

import { ClientProviders } from '@/lib/providers'

import './globals.css'

export const metadata: Metadata = {
  title: 'Get a Farcaster Account',
  description:
    'Sign up to have your Farcaster registration paid for by a friend',
  openGraph: {
    images: ['/sharing.jpg'],
  },
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
          <div
            className="flex flex-col justify-center items-center p-6 min-h-screen w-full max-w-3xl my-0 mx-auto"
            style={{
              minHeight: '100svh', // safe view height, tailwind doesn't support it
            }}
          >
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
