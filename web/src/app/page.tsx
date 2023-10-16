'use client'

import { Button } from '@ensdomains/thorin'
import { useAccount, useContractRead, useDisconnect, useNetwork } from 'wagmi'

import { ConnectButton } from '@/components/ConnectButton'
import { Sign } from '@/components/Sign'
import { PurpleHelper, SubTitle, Title } from '@/components/atoms'
import { idRegistryContract } from '@/contracts'

export default function Home() {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

  const isConnected = !!address

  const { data: ownedFid } = useContractRead({
    ...idRegistryContract,
    functionName: 'idOf',
    args: address ? [address] : undefined,
  })

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid items-center gap-3 text-center">
        <Title>Get a Farcaster account</Title>
        <SubTitle as="h2" color="textTertiary">
          Does somebody want to have you on Farcaster?
        </SubTitle>
      </div>

      {(() => {
        if (!isConnected || chain?.unsupported) {
          return <ConnectButton />
        }

        if (ownedFid && ownedFid > 0n) {
          return (
            <div className="flex flex-col items-center gap-4 w-fit">
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
          <div className="w-full max-w-sm">
            <Sign connectedAddress={address} />
          </div>
        )
      })()}
    </div>
  )
}
