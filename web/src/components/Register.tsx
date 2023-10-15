'use client'

import { Button, Typography } from '@ensdomains/thorin'
import {
  Address,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { gifterContract } from '@/contracts'

type Props = {
  address: Address
  deadline: bigint
  signature: Address
}

export function Register({ address, deadline, signature }: Props) {
  const extraWei = 60000000000000n

  const { data: storagePrice } = useContractRead({
    ...gifterContract,
    functionName: 'price',
    args: [1n],
  })

  const prepare = usePrepareContractWrite({
    ...gifterContract,
    functionName: 'register',
    enabled: !!storagePrice,
    value: storagePrice ? storagePrice + extraWei : undefined,
    args: [
      {
        to: address,
        recovery: address,
        deadline,
        sig: signature,
      }, // registration
      [], // signers
      1n, // storage units
      extraWei, // extra wei
    ],
  })

  const tx = useContractWrite(prepare.config)
  const receipt = useWaitForTransaction(tx.data)

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
                  {storagePrice
                    ? `for ${(Number(storagePrice) / 1e18).toFixed(5)} ETH`
                    : 'account'}
                </>
              )}
            </Button>

            {prepare.isError && (
              <p>
                {prepare.error?.message.includes('insufficient funds for gas')
                  ? 'Insufficient funds'
                  : prepare.error?.message.includes('0xf90230a9')
                  ? 'User already has an FID'
                  : 'Error preparing the transaction'}
              </p>
            )}
          </div>
        )
      })()}
    </div>
  )
}
