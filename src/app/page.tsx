'use client'

import { Button, Heading } from '@ensdomains/thorin'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useDisconnect, useNetwork } from 'wagmi'

import { ConnectButton } from '@/components/ConnectButton'
import { Sign } from '@/components/Sign'
import { PurpleHelper, Title } from '@/components/atoms'
import { idRegistryContract } from '@/contracts'

export default function Home() {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

  const isConnected = !!address
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
          Request a free account
        </Heading>
      </div>

      {(() => {
        if (!isConnected || chain?.unsupported) {
          return <ConnectButton />
        }

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

        return (
          <div style={{ width: '100%', maxWidth: '26rem' }}>
            <Sign connectedAddress={address} />
          </div>
        )
      })()}
    </div>
  )
}
