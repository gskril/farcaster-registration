import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { hardhat, mainnet, optimism } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const devChains = process.env.NEXT_PUBLIC_TESTNETS === 'true' ? [hardhat] : []

export const chains = [optimism, mainnet, ...devChains]

export const { publicClient, webSocketPublicClient } = configureChains(
  chains,
  [publicProvider()],
  {
    batch: {
      multicall: {
        batchSize: 2_048,
      },
    },
  }
)

const { connectors } = getDefaultWallets({
  appName: 'Farcaster Registration',
  projectId: 'd6c989fb5e87a19a4c3c14412d5a7672',
  chains: [optimism, ...devChains],
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})
