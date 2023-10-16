'use client'

import { Button } from '@ensdomains/thorin'
import { Address, useEnsName } from 'wagmi'

export function Content({ keys }: { keys: string[] }) {
  return (
    <div className="flex flex-col gap-4 max-w-full">
      {keys.map((key) => {
        return <Key key={key} address={key} />
      })}
    </div>
  )
}

function Key({ address }: { address: string }) {
  const { data: ensName } = useEnsName({
    address: address as Address,
    chainId: 1,
  })

  return (
    <Button
      as="a"
      href={`/sponsor/${address}`}
      key={address}
      colorStyle="purplePrimary"
    >
      {ensName || address}
    </Button>
  )
}
