import { useMemo } from 'react'
import { Button, Callout, Flex, Text } from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  Address,
  useSignTypedData,
  useContractRead,
} from 'wagmi'

import {
  bundlerContract,
  idRegistryContract,
  storageRegistryContract,
} from '../contracts'
import {
  SignatureTypes,
  ID_REGISTRY_EIP_712_DOMAIN,
} from '../contracts/id-registry'
import { truncateAddress } from '../utils'

type Props = {
  connectedAddress: Address
  recipient: Address
}

export function Register({ connectedAddress, recipient }: Props) {
  const idOf = useContractRead({
    ...idRegistryContract,
    functionName: 'idOf',
    args: [connectedAddress],
  })

  const deadline = useMemo(
    () => BigInt(Date.now() + 1000 * 60 * 60 * 24 * 7),
    []
  )

  const message = {
    to: connectedAddress,
    recovery: recipient,
    nonce: 0n,
    deadline,
  }

  const signature = useSignTypedData({
    domain: ID_REGISTRY_EIP_712_DOMAIN,
    types: SignatureTypes,
    primaryType: 'Register',
    message,
  })

  const storagePrice = useContractRead({
    ...storageRegistryContract,
    functionName: 'price',
    args: [1n],
    enabled: !!signature.data,
  })

  const prepare = usePrepareContractWrite({
    ...bundlerContract,
    functionName: 'register',
    enabled: !!signature.data && !!storagePrice.data,
    value: storagePrice.data,
    chainId: 10,
    args: [
      {
        to: connectedAddress,
        recovery: recipient,
        deadline,
        sig: signature.data!,
      }, // registration
      [], // signers
      1n, // storage units
    ],
  })

  const tx = useContractWrite(prepare.config)
  const receipt = useWaitForTransaction(tx.data)

  return (
    <Flex direction="column" gap="2" align="center">
      {(() => {
        if (idOf.data) {
          return <Text>You already have an FID (#{Number(idOf.data)})</Text>
        }

        if (!signature.data) {
          return (
            <>
              {signature.isError ? (
                <Button
                  size="3"
                  onClick={() => signature.signTypedData?.()}
                  color="red"
                >
                  Failed to sign, try again
                </Button>
              ) : (
                <Button size="3" onClick={() => signature.signTypedData?.()}>
                  Sign message
                </Button>
              )}

              <Text>Recipient: {truncateAddress(recipient)}</Text>
            </>
          )
        }

        if (receipt.isSuccess) {
          return <Text>Success!</Text>
        }

        if (receipt.isError) {
          return <Text>Transaction failed :/</Text>
        }

        if (receipt.isLoading) {
          return <Text>Waiting for transaction to confirm...</Text>
        }

        return (
          <>
            <Button
              size="3"
              onClick={() => tx.write?.()}
              disabled={!tx.write}
              style={{ width: 'fit-content' }}
            >
              Register{' '}
              {storagePrice.data
                ? `for ${(Number(storagePrice.data) / 1e18).toFixed(5)} ETH`
                : 'account'}
            </Button>

            {prepare.isError && (
              <Callout.Root color="red" role="alert">
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>Cannot prepare the transaction</Callout.Text>
              </Callout.Root>
            )}
          </>
        )
      })()}
    </Flex>
  )
}
