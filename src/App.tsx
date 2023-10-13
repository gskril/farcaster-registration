import { useEffect, useState } from 'react'
import { Container, Flex, Heading, TextField, Text } from '@radix-ui/themes'
import { useAccount, useContractRead } from 'wagmi'
import { isAddress } from 'viem'

import { Register } from './components/Register'
import { ConnectButton } from './components/ConnectButton'
import { idRegistryContract } from './contracts'

export default function App() {
  const { address } = useAccount()
  const isConnected = !!address
  const [recipient, setRecipient] = useState('')
  const [ownedFid, setOwnedFid] = useState<bigint>(0n)

  const idOf = useContractRead({
    ...idRegistryContract,
    functionName: 'idOf',
    args: address ? [address] : undefined,
  })

  useEffect(() => {
    if (idOf.data) {
      setOwnedFid(idOf.data)
    }
  }, [idOf])

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

          // Transfer flow if the user already has an FID
          if (ownedFid > 0n) {
            return <Text>You already have an FID (#{Number(ownedFid)})</Text>
          }

          // Registration flow if the user doesn't have an FID yet
          return (
            <Flex
              direction="column"
              width="100%"
              gap="3"
              style={{ maxWidth: '26rem' }}
            >
              {isAddress(recipient) ? (
                <Register
                  connectedAddress={address}
                  recipient={recipient}
                  ownedFid={ownedFid}
                  setOwnedFid={setOwnedFid}
                />
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
