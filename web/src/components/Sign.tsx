import { lightTheme } from '@ensdomains/thorin'
import { usePlausible } from 'next-plausible'
import { useMemo, useState } from 'react'
// @ts-ignore
import { experimental_useFormState as useFormState } from 'react-dom'
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import QRCode from 'react-qr-code'
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
  const plausible = usePlausible()

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
    onSuccess: () => plausible('Signature'),
  })

  const [formState, formAction] = useFormState(createKv, initialState)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  const urlToSponsorPage = `https://gift.fcstr.xyz/sponsor/${formState.message}`

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <Step
        state={
          !!signature.data
            ? 'complete'
            : signature.isLoading
            ? 'loading'
            : 'active'
        }
        label="1. Sign message"
        onClick={() => signature.signTypedData?.()}
      />

      <form action={formAction} className="w-full">
        <input type="hidden" name="address" value={connectedAddress} />
        <input type="hidden" name="deadline" value={Number(deadline)} />
        <input type="hidden" name="sig" value={signature.data} />

        <SubmitButton formState={formState} signature={signature.data} />
      </form>

      <Step
        state={
          copiedToClipboard ? 'complete' : formState.ok ? 'active' : 'disabled'
        }
        label="3. Share with your gifter"
        onClick={async () => {
          await copyToClipBoard(urlToSponsorPage)
          setCopiedToClipboard(true)
        }}
      />

      {copiedToClipboard && (
        <div className="flex flex-col gap-2 items-center w-full">
          <PurpleHelper showIcon={false}>
            <span>
              Share the{' '}
              <a
                href={urlToSponsorPage}
                style={{
                  color: lightTheme.colors.purplePrimary,
                  textDecoration: 'underline',
                }}
              >
                copied URL
              </a>{' '}
              or this QR code
            </span>
          </PurpleHelper>

          <div className="bg-white p-1 rounded-sm max-w-[10rem]">
            <QRCode
              size={256}
              viewBox={`0 0 256 256`}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={urlToSponsorPage}
            />
          </div>
        </div>
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
      label="2. Save response"
      onClick={() => {}}
      type="submit"
      aria-disabled={pending}
    />
  )
}
