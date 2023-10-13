import { Container, Flex, Heading } from '@radix-ui/themes'
import { useAccount } from 'wagmi'

import { Register } from './components/Register'
import { ConnectButton } from './components/ConnectButton'

export default function App() {
  const { address } = useAccount()
  const isConnected = !!address

  return (
    <Container size="2">
      <Flex
        className="wrapper"
        direction="column"
        justify="center"
        align="center"
        gap="5"
      >
        <Flex direction="column" align="center" gap="1">
          <Heading size={{ initial: '8', sm: '9' }} align="center">
            Gift a Farcaster Account
          </Heading>
          <Heading
            as="h2"
            size={{ initial: '5', sm: '7' }}
            align="center"
            color="gray"
          >
            Includes storage for 1 year
          </Heading>
        </Flex>

        <ConnectButton />

        {(() => {
          if (!isConnected) return

          // TODO: add an input for the recipient address
          return <Register recipient={address} />
        })()}
      </Flex>
    </Container>
  )
}
