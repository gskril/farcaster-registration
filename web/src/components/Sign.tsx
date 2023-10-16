import { useMemo, useState } from 'react'
// @ts-ignore
import { experimental_useFormState as useFormState } from 'react-dom'
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import { Address, useNetwork, useSignTypedData } from 'wagmi'

import { createKv } from '@/actions/createKv'
import {
  SignatureTypes,
  useIdRegistryEip712Domain,
} from '@/contracts/id-registry'
import { copyToClipBoard } from '@/lib/utils'

import { Step } from './Step'
import { PurpleHelper } from './atoms'

const initialState = {
  ok: false,
  message: '',
}

export function Sign({ connectedAddress }: { connectedAddress: Address }) {
  const { chain } = useNetwork()
  const ID_REGISTRY_EIP_712_DOMAIN = useIdRegistryEip712Domain(chain?.id)

  // 7 days from now
  const deadline = useMemo(
    () => BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7),
    []
  )

  const message = {
    to: connectedAddress,
    recovery: connectedAddress,
    nonce: 0n,
    deadline,
  }

  const signature = useSignTypedData({
    domain: ID_REGISTRY_EIP_712_DOMAIN,
    types: SignatureTypes,
    primaryType: 'Register',
    message,
  })

  const [formState, formAction] = useFormState(createKv, initialState)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  return (
    <div className="grid gap-4 w-full">
      <Step
        state={
          !!signature.data
            ? 'complete'
            : signature.isLoading
            ? 'loading'
            : 'active'
        }
        label="Sign message"
        onClick={() => signature.signTypedData?.()}
      />

      <form action={formAction}>
        <input type="hidden" name="address" value={connectedAddress} />
        <input type="hidden" name="deadline" value={Number(deadline)} />
        <input type="hidden" name="sig" value={signature.data} />

        <SubmitButton formState={formState} signature={signature.data} />
      </form>

      <Step
        state={
          copiedToClipboard ? 'complete' : formState.ok ? 'active' : 'disabled'
        }
        label="Copy URL"
        onClick={async () => {
          await copyToClipBoard(
            `https://farcaster-registration.vercel.app/sponsor/${formState.message}`
          )
          setCopiedToClipboard(true)
        }}
      />

      {copiedToClipboard && (
        <PurpleHelper className="max-w-sm">
          Send the copied URL to the person who's paying your Farcaster account
        </PurpleHelper>
      )}
    </div>
  )
}

function SubmitButton({
  signature,
  formState,
}: {
  signature: Address | undefined
  formState: typeof initialState
}) {
  const { pending } = useFormStatus()

  return (
    <Step
      state={
        formState.ok
          ? 'complete'
          : pending
          ? 'loading'
          : !!signature
          ? 'active'
          : 'disabled'
      }
      label="Save message"
      onClick={() => {}}
      type="submit"
      aria-disabled={pending}
    />
  )
}
