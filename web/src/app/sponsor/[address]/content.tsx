'use client'

import { Button } from '@ensdomains/thorin'
import { usePathname } from 'next/navigation'
import QRCode from 'react-qr-code'
import { Address } from 'viem'
import { useAccount, useContractRead, useEnsName, useNetwork } from 'wagmi'

import { ConnectButton } from '@/components/ConnectButton'
import { Register } from '@/components/Register'
import { PurpleHelper, SubTitle, Title } from '@/components/atoms'
import { idRegistryContract } from '@/contracts'
import { truncateAddress } from '@/lib/utils'

type Props = {
  address: Address
  deadline: bigint
  signature: Address
}

export default function Sponsor({
  address: recipient,
  deadline,
  signature,
}: Props) {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { data: ensName } = useEnsName({ address: recipient, chainId: 1 })

  const hostname = 'https://gift.fcstr.xyz'
  const pathname = usePathname()

  const { data: ownedFid } = useContractRead({
    ...idRegistryContract,
    functionName: 'idOf',
    args: [recipient],
  })

  const isConnected = !!address

  // prettier-ignore
  const viewerRequesterMatch = address?.toLowerCase() === recipient.toLowerCase()

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid items-center gap-4 text-center">
        <Title>Gift a Farcaster account</Title>
        <SubTitle level="2" color="textTertiary">
          Give {ensName || truncateAddress(recipient)} one year free
        </SubTitle>
      </div>

      {viewerRequesterMatch && ownedFid === 0n && (
        <PurpleHelper className="max-w-sm" showIcon={false}>
          <span>
            Send this page to the person you want to sponsor your Farcaster
            account registration
          </span>

          <div className="bg-white p-1 rounded-sm max-w-[10rem]">
            <QRCode
              size={256}
              viewBox={`0 0 256 256`}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={hostname + pathname}
            />
          </div>
        </PurpleHelper>
      )}

      {(() => {
        if (!isConnected || chain?.unsupported) {
          return <ConnectButton />
        }

        if (ownedFid && ownedFid > 0n) {
          return (
            <div className="grid gap-3 w-fit">
              <PurpleHelper>
                This address already has an account. Try a client!
              </PurpleHelper>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  as="a"
                  href="https://flink.fyi/"
                  target="_blank"
                  colorStyle="purplePrimary"
                >
                  flink.fyi
                </Button>

                <Button
                  as="a"
                  href="https://farcord.com/"
                  target="_blank"
                  colorStyle="purpleSecondary"
                >
                  farcord.com
                </Button>
              </div>
            </div>
          )
        }

        return (
          <div style={{ width: '100%', maxWidth: '26rem' }}>
            <Register
              name={ensName || truncateAddress(recipient)}
              address={recipient}
              deadline={deadline}
              signature={signature}
            />
          </div>
        )
      })()}
    </div>
  )
}
