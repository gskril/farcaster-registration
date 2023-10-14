'use client'

import { Heading } from '@ensdomains/thorin'
import { Address } from 'viem'
import { useAccount, useEnsName, useNetwork } from 'wagmi'

import { ConnectButton } from '@/components/ConnectButton'
import { Register } from '@/components/Register'
import { PurpleHelper, SubTitle, Title } from '@/components/atoms'
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

  const isConnected = !!address

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Title className="text-center">Sponsor a Registration</Title>
        <SubTitle level="2" color="textTertiary">
          {ensName || truncateAddress(recipient)}
        </SubTitle>
      </div>

      {address?.toLowerCase() === recipient.toLowerCase() && (
        <PurpleHelper className="max-w-sm">
          Send this page to the person you want to sponsor your Farcaster
          account registration
        </PurpleHelper>
      )}

      {(() => {
        if (!isConnected || chain?.unsupported) {
          return <ConnectButton />
        }

        return (
          <div style={{ width: '100%', maxWidth: '26rem' }}>
            <Register
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
