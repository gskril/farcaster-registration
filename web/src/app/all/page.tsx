import { kv } from '@vercel/kv'
import { Metadata } from 'next'
import { Address } from 'viem'

import { Content } from './content'

export const metadata: Metadata = {
  title: 'Farcaster Account Requests',
  description: 'All open requests for a free Farcaster account',
}

export default async function Page() {
  const keys = (await kv.keys('0x*')) as Address[] | undefined

  if (!keys) {
    return <p>no keys</p>
  }

  return <Content keys={keys} />
}
