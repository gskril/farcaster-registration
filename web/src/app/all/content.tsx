'use client'

import { Button } from '@ensdomains/thorin'
import { Address, useContractRead, useEnsName } from 'wagmi'

import { idRegistryContract } from '@/contracts'
import { truncateAddress } from '@/lib/utils'

export function Content({ keys }: { keys: Address[] }) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {keys.map((key) => {
        return <Key key={key} address={key} />
      })}
    </div>
  )
}

function Key({ address }: { address: Address }) {
  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  })

  const { data: idOf } = useContractRead({
    ...idRegistryContract,
    functionName: 'idOf',
    args: [address],
  })

  return (
    <Button
      as={!!idOf ? undefined : 'a'}
      disabled={!!idOf}
      href={`/sponsor/${address}`}
      key={address}
      colorStyle="purplePrimary"
    >
      {ensName || truncateAddress(address)} {!!idOf && '(has account)'}
    </Button>
  )
}
