import { Heading } from '@radix-ui/themes'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Register } from './components/Register'

export default function App() {
  const { address } = useAccount()
  const isConnected = !!address

  return (
    <>
      <Heading>Gift a Farcaster Account</Heading>
      <Heading as="h2" size="4">
        Includes an fid and 1 storage unit
      </Heading>

      <ConnectButton />

      {(() => {
        if (!isConnected) {
          return <p>Not connected</p>
        }

        // TODO: add an input for the recipient address
        return <Register recipient={address} />
      })()}
    </>
  )
}
