import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { Theme } from '@radix-ui/themes'

import App from './App.tsx'
import { chains, wagmiConfig } from './providers.ts'

import './normalize.css'
import '@radix-ui/themes/styles.css'
import '@rainbow-me/rainbowkit/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <Theme accentColor="purple">
        <RainbowKitProvider chains={chains} modalSize="compact">
          <App />
        </RainbowKitProvider>
      </Theme>
    </WagmiConfig>
  </React.StrictMode>
)
