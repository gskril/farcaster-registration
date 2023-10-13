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

import {
  SignatureDomain,
  SignatureTypes,
  bundlerContract,
} from '../contracts/bundler'
import { storageRegistryContract } from '../contracts/storage-registry'

// ---- start temp code ---- //
import { createPublicClient, http } from 'viem'
import { optimism } from 'viem/chains'

const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
})
// ---- end temp code ---- //

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
    domain: SignatureDomain,
    types: SignatureTypes,
    primaryType: 'Registration',
    message,
  })

  // ---- start temp code ---- //
  useEffect(() => {
    // slopily verify the signature to make sure I'm not being dumb
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

      console.log({ message, signature: signature.data, verified })
    }

    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature.data])
  // ---- end temp code ---- //

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
