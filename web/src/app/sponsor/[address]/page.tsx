import { kv } from '@vercel/kv'
import { Metadata } from 'next/types'
import { Address, isAddress } from 'viem'

import Sponsor from './content'

export const metadata: Metadata = {
  title: 'Gift a Farcaster Account',
  description: "Pay for someone else's first year on Farcaster",
}

export default async function Page({
  params,
}: {
  params: { address: string }
}) {
  if (!isAddress(params.address)) {
    return <p>Invalid address input</p>
  }

  const signature = (await kv.get(params.address)) as
    | { sig: Address; deadline: number }
    | undefined

  if (!signature) {
    return <p>No registration request</p>
  }

  return (
    <Sponsor
      address={params.address}
      deadline={BigInt(signature.deadline)}
      signature={signature.sig}
    />
  )
}
