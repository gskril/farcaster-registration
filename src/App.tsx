import { Container, Flex, Heading, TextField } from '@radix-ui/themes'
import { useAccount } from 'wagmi'

import { Register } from './components/Register'
import { ConnectButton } from './components/ConnectButton'
import { isAddress } from 'viem'
import { useState } from 'react'

export default function App() {
  const { address } = useAccount()
  const isConnected = !!address
  const [recipient, setRecipient] = useState('')

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
            Register for Farcaster
          </Heading>
          <Heading
            as="h2"
            size={{ initial: '5', sm: '7' }}
            align="center"
            color="gray"
          >
            $7 for the first year
          </Heading>
        </Flex>

        {(() => {
          if (!isConnected) {
            return <ConnectButton />
          }

          return (
            <Flex
              direction="column"
              width="100%"
              gap="3"
              style={{ maxWidth: '26rem' }}
            >
              {isAddress(recipient) ? (
                <Register connectedAddress={address} recipient={recipient} />
              ) : (
                <TextField.Root>
                  <TextField.Input
                    placeholder="ETH address for recovery"
                    size="3"
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </TextField.Root>
              )}
            </Flex>
          )
        })()}
      </Flex>
    </Container>
  )
}
