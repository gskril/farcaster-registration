'use client'

import { Button, Helper, Typography } from '@ensdomains/thorin'
import {
  Address,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { useGifterContract } from '@/contracts'

import { PurpleHelper } from './atoms'

type Props = {
  name: string
  address: Address
  deadline: bigint
  signature: Address
}

export function Register({ name, address, deadline, signature }: Props) {
  const { chain } = useNetwork()
  const gifterContract = useGifterContract(chain?.id)

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
          return (
            <div className="grid gap-4">
              <PurpleHelper>
                Success! {name} can now use their account with a range of
                clients
              </PurpleHelper>

              <Button
                as="a"
                href="https://www.farcaster.xyz/apps"
                target="_blank"
                colorStyle="purplePrimary"
              >
                Explore the ecosystem
              </Button>
            </div>
          )
        }

        if (receipt.isError) {
          return <Helper type="error">Transaction failed :/</Helper>
        }

        return (
          <div className="grid justify-center text-center gap-2">
            <Button
              colorStyle={tx.isError ? 'redPrimary' : 'purplePrimary'}
              onClick={() => tx.write?.()}
              loading={tx.isLoading || receipt.isLoading}
              disabled={!tx.write || tx.isLoading || receipt.isLoading}
            >
              {tx.isError ? (
                <>Failed to register, try again</>
              ) : receipt.isLoading ? (
                <>Transaction processing</>
              ) : (
                <>Register for ~$7.77</>
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
