'use server'

import { kv } from '@vercel/kv'
import { isAddress } from 'viem'
import z from 'zod'

const formSchema = z.object({
  address: z.string().refine(isAddress, {
    message: 'Invalid address',
  }),
  deadline: z.coerce.number(),
  sig: z.string(),
})

export async function createKv(formData: FormData) {
  const safeParse = formSchema.safeParse({
    address: formData.get('address'),
    deadline: formData.get('deadline'),
    sig: formData.get('sig'),
  })

  if (!safeParse.success) {
    console.error(safeParse.error)
    throw new Error('Invalid form data')
  }

  const { address, deadline, sig } = safeParse.data

  try {
    await kv.set(address, JSON.stringify({ sig, deadline }))
    return { ok: true, message: address }
  } catch (error) {
    return { ok: false, message: 'Failed to create KV' }
  }
}
