const ID_REGISTRY_REGISTER_TYPE = [
  { name: 'to', type: 'address' },
  { name: 'recovery', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
] as const

export const SignatureTypes = {
  Register: ID_REGISTRY_REGISTER_TYPE,
}

export const ID_REGISTRY_EIP_712_DOMAIN = {
  name: 'Farcaster IdRegistry',
  version: '1',
  chainId: 10,
  verifyingContract: '0x00000000fcaf86937e41ba038b4fa40baa4b780a',
} as const
