'use client'

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

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid items-center gap-4 text-center">
        <Title>Gift a Farcaster account</Title>
        <SubTitle level="2" color="textTertiary">
          Give {ensName || truncateAddress(recipient)} one year free
        </SubTitle>
      </div>

      {address?.toLowerCase() === recipient.toLowerCase() && (
        <PurpleHelper className="max-w-sm">
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
            <div className="w-fit">
              <PurpleHelper>
                This address already has an account (FID #{Number(ownedFid)})
              </PurpleHelper>
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
