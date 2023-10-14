'use client'

import { Button, Typography } from '@ensdomains/thorin'
import {
  Address,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { bundlerContract, storageRegistryContract } from '../contracts'

type Props = {
  address: Address
  deadline: bigint
  signature: Address
}

export function Register({ address, deadline, signature }: Props) {
  const storagePrice = useContractRead({
    ...storageRegistryContract,
    functionName: 'price',
    args: [1n],
  })

  const prepare = usePrepareContractWrite({
    ...bundlerContract,
    functionName: 'register',
    enabled: !!storagePrice.data,
    value: storagePrice.data,
    chainId: 10,
    args: [
      {
        to: address,
        recovery: address,
        deadline,
        sig: signature,
      }, // registration
      [], // signers
      1n, // storage units
    ],
  })

  const tx = useContractWrite(prepare.config)
  const receipt = useWaitForTransaction(tx.data)
  // TODO: decode the logs from the transaction receipt to get the newly registered FID and call `setOwnedFid`

  return (
    <div>
      {(() => {
        if (receipt.isSuccess) {
          return <Typography>Success!</Typography>
        }

        if (receipt.isError) {
          return <Typography>Transaction failed :/</Typography>
        }

        if (receipt.isLoading) {
          return <Typography>Waiting for transaction to confirm...</Typography>
        }

        return (
          <div className="grid justify-center text-center gap-2">
            <Button
              colorStyle={tx.isError ? 'redPrimary' : 'purplePrimary'}
              onClick={() => tx.write?.()}
              disabled={!tx.write}
            >
              {tx.isError ? (
                <>Failed to register, try again</>
              ) : (
                <>
                  Register{' '}
                  {storagePrice.data
                    ? `for ${(Number(storagePrice.data) / 1e18).toFixed(5)} ETH`
                    : 'account'}
                </>
              )}
            </Button>

            {prepare.isError && <p>Cannot prepare the transaction</p>}
          </div>
        )
      })()}
    </div>
  )
}
