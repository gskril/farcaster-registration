import { Button, Typography } from '@ensdomains/thorin'
import { useMemo } from 'react'
import {
  Address,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
  useWaitForTransaction,
} from 'wagmi'

import { bundlerContract, storageRegistryContract } from '../contracts'
import {
  ID_REGISTRY_EIP_712_DOMAIN,
  SignatureTypes,
} from '../contracts/id-registry'
import { truncateAddress } from '../utils'

type Props = {
  connectedAddress: Address
  recipient: Address
  ownedFid: bigint
  setOwnedFid: (fid: bigint) => void
}

export function Register({
  connectedAddress,
  recipient,
}: // setOwnedFid,
Props) {
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
  // TODO: decode the logs from the transaction receipt to get the newly registered FID and call `setOwnedFid`

  return (
    <div>
      {(() => {
        if (!signature.data) {
          return (
            <div className="grid justify-center text-center gap-2">
              <Button
                colorStyle={signature.isError ? 'redPrimary' : 'purplePrimary'}
                onClick={() => signature.signTypedData?.()}
              >
                {signature.isError
                  ? 'Failed to sign, try again'
                  : 'Sign Message'}
              </Button>

              <Typography>Recipient: {truncateAddress(recipient)}</Typography>
            </div>
          )
        }

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
