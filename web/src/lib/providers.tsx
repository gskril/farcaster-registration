'use client'

import { useEffect, useState } from 'react'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import { ThemeProvider } from 'styled-components'

import StyledComponentsRegistry from '@/lib/styled-components-registry'
import { chains, wagmiConfig } from '@/lib/web3'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <StyledComponentsRegistry>
        <ThemeProvider theme={lightTheme}>
          <ThorinGlobalStyles />
          <RainbowKitProvider chains={chains}>
            {mounted && children}
          </RainbowKitProvider>
        </ThemeProvider>
      </StyledComponentsRegistry>
    </WagmiConfig>
  )
}
