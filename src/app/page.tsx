'use client'

import { Button, Heading, Input } from '@ensdomains/thorin'
import { useEffect, useState } from 'react'
import { isAddress } from 'viem'
import { useAccount, useContractRead, useDisconnect, useNetwork } from 'wagmi'

import { ConnectButton } from '@/components/ConnectButton'
import { Register } from '@/components/Register'
import { PurpleHelper, Title } from '@/components/atoms'
import { idRegistryContract } from '@/contracts'

export default function Home() {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

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
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Title>Register for Farcaster</Title>
        <Heading level="2" color="textTertiary">
          $7 for the first year
        </Heading>
      </div>

      {(() => {
        if (!isConnected || chain?.unsupported) {
          return <ConnectButton />
        }

        // Transfer flow if the user already has an FID
        if (ownedFid > 0n) {
          return (
            <div className="flex flex-col items-center gap-2 w-fit">
              <PurpleHelper>
                You already have an FID (#{Number(ownedFid)})
              </PurpleHelper>

              <Button
                colorStyle="purpleSecondary"
                onClick={() => disconnect?.()}
              >
                Disconnect
              </Button>
            </div>
          )
        }

        // Registration flow if the user doesn't have an FID yet
        return (
          <div style={{ width: '100%', maxWidth: '26rem' }}>
            {isAddress(recipient) ? (
              <Register
                connectedAddress={address}
                recipient={recipient}
                ownedFid={ownedFid}
                setOwnedFid={setOwnedFid}
              />
            ) : (
              <Input
                label=""
                hideLabel={true}
                placeholder="ETH address for recovery"
                onChange={(e) => setRecipient(e.target.value)}
              />
            )}
          </div>
        )
      })()}
    </div>
  )
}
