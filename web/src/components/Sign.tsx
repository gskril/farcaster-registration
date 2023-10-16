import { Button } from '@ensdomains/thorin'
import { redirect } from 'next/navigation'
import { useMemo } from 'react'
import { Address, useNetwork, useSignTypedData } from 'wagmi'

import { createKv } from '@/actions/createKv'
import {
  SignatureTypes,
  useIdRegistryEip712Domain,
} from '@/contracts/id-registry'

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

  async function handleCreateKv(formData: FormData) {
    const { ok, message } = await createKv(formData)

    if (!ok) {
      return alert(message)
    }

    return redirect(`/sponsor/${message}`)
  }

  return (
    <div>
      {(() => {
        if (signature.data) {
          return (
            <form action={handleCreateKv} className="grid justify-center">
              <input type="hidden" name="address" value={connectedAddress} />
              <input type="hidden" name="deadline" value={Number(deadline)} />
              <input type="hidden" name="sig" value={signature.data} />
              <Button colorStyle="purplePrimary" type="submit">
                Save request
              </Button>
            </form>
          )
        }

        return (
          <div className="grid justify-center text-center gap-2">
            <Button
              colorStyle={signature.isError ? 'redPrimary' : 'purplePrimary'}
              onClick={() => signature.signTypedData?.()}
            >
              {signature.isError ? 'Failed to sign, try again' : 'Sign Message'}
            </Button>
          </div>
        )
      })()}
    </div>
  )
}
