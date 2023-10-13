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

export function Register({ recipient }: RegisterProps) {
  const sigDeadline = Math.floor(Date.now() / 1000) + 60 * 60

  const signature = useSignTypedData({
    message: {
      to: recipient,
      recovery: recipient,
      nonce: 0n,
      deadline: BigInt(sigDeadline),
    },
    primaryType: 'Registration',
    types: SignatureTypes,
    domain: {},
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
    args: [
      {
        to: recipient,
        recovery: recipient,
        deadline: BigInt(sigDeadline),
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
