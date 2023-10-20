import '@rainbow-me/rainbowkit/styles.css'
import type { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'

import { ClientProviders } from '@/lib/providers'

import './globals.css'

export const metadata: Metadata = {
  title: 'Get a Farcaster Account',
  description:
    'Sign up to have your Farcaster registration paid for by a friend',
  icons: [
    {
      rel: 'icon',
      sizes: '32x32',
      media: '(prefers-color-scheme: dark)',
      url: './favicon/32-light.png',
    },
    {
      rel: 'icon',
      sizes: '64x64',
      media: '(prefers-color-scheme: dark)',
      url: './favicon/64-light.png',
    },
    {
      rel: 'icon',
      sizes: '128x128',
      media: '(prefers-color-scheme: dark)',
      url: './favicon/128-light.png',
    },
    {
      rel: 'icon',
      sizes: '256x256',
      media: '(prefers-color-scheme: dark)',
      url: './favicon/256-light.png',
    },
    {
      rel: 'icon',
      sizes: '32x32',
      media: '(prefers-color-scheme: light)',
      url: './favicon/32-dark.png',
    },
    {
      rel: 'icon',
      sizes: '64x64',
      media: '(prefers-color-scheme: light)',
      url: './favicon/64-dark.png',
    },
    {
      rel: 'icon',
      sizes: '128x128',
      media: '(prefers-color-scheme: light)',
      url: './favicon/128-dark.png',
    },
    {
      rel: 'icon',
      sizes: '256x256',
      media: '(prefers-color-scheme: light)',
      url: './favicon/256-dark.png',
    },
  ],
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
      <head>
        <PlausibleProvider domain="gift.fcstr.xyz" trackOutboundLinks />
      </head>

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
