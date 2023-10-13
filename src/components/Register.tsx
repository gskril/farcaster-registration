import { useEffect, useMemo } from 'react'
import { Button } from '@radix-ui/themes'
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

import { createPublicClient, http } from 'viem'
import { optimism } from 'viem/chains'

const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
})

type RegisterProps = {
  recipient: Address
}

const SignatureTypes = {
  Registration: [
    { name: 'to', type: 'address' },
    { name: 'recovery', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const

const SignatureDomain = {
  name: 'Farcaster Bundler',
  version: '1',
  chainId: 10,
  verifyingContract: '0x00000000fc94856f3967b047325f88d47bc225d0',
} as const

export function Register({ recipient }: RegisterProps) {
  const deadline = useMemo(
    () => BigInt(Date.now() + 1000 * 60 * 60 * 24 * 7),
    []
  )

  const message = useMemo(
    () => ({
      to: recipient,
      recovery: recipient,
      nonce: 0n,
      deadline,
    }),
    [deadline, recipient]
  )

  const signature = useSignTypedData({
    domain: SignatureDomain,
    types: SignatureTypes,
    primaryType: 'Registration',
    message,
  })

  // slopily verify the signature to make sure I'm not being dumb
  useEffect(() => {
    async function verify() {
      if (!signature.data) {
        return
      }

      const verified = await publicClient.verifyTypedData({
        address: recipient,
        domain: SignatureDomain,
        message,
        types: SignatureTypes,
        primaryType: 'Registration',
        signature: signature.data,
      })

      console.log({ verified })
    }

    verify()
  }, [message, recipient, signature.data])

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
    <>
      {(() => {
        if (signature.isError) {
          console.log(signature.error)
          return <p>Failed to sign message</p>
        }

        if (!signature.data) {
          return (
            <Button onClick={() => signature.signTypedData?.()}>
              Authenticate
            </Button>
          )
        }

        if (receipt.isSuccess) {
          return <p>Success!</p>
        }

        if (receipt.isError) {
          return <p>Transaction failed :/</p>
        }

        if (receipt.isLoading) {
          return <p>Waiting for transaction to confirm...</p>
        }

        return (
          <>
            {/* We'd expect the button to be writable here, but it's not */}
            {!tx.write && (
              <p>
                Signature captured but something is wrong, check the console
              </p>
            )}

            <Button onClick={() => tx.write?.()} disabled={!tx.write}>
              Register
            </Button>
          </>
        )
      })()}
    </>
  )
}
