import { useEffect, useMemo } from 'react'
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

import { bundlerContract } from '../contracts/bundler'
import { storageRegistryContract } from '../contracts/storage-registry'
import {
  SignatureTypes,
  ID_REGISTRY_EIP_712_DOMAIN,
} from '../contracts/id-registry'

export function Register({ recipient }: { recipient: Address }) {
  const deadline = useMemo(
    () => BigInt(Date.now() + 1000 * 60 * 60 * 24 * 7),
    []
  )

  const message = {
    to: recipient,
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
        to: recipient,
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
        if (signature.isError) {
          return <Text>Failed to sign message</Text>
        }

        if (!signature.data) {
          return (
            <Button size="3" onClick={() => signature.signTypedData?.()}>
              Sign Message
            </Button>
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

        if (prepare.isError) {
          console.error(prepare.error)
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
                : 'Account'}
            </Button>

            {/* We'd expect the button to be writable here, but it's not */}
            {!tx.write && (
              <Callout.Root color="red" role="alert">
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>
                  Cannot prepare the transaction, check the console.
                </Callout.Text>
              </Callout.Root>
            )}
          </>
        )
      })()}
    </Flex>
  )
}
