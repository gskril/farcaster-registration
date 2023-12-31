import { useMemo } from 'react'
import { Address } from 'viem'
import { hardhat } from 'viem/chains'

const abi = [
  {
    inputs: [
      {
        internalType: 'uint8',
        name: '_feePercentage',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: '_initialOwner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_bundlerAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'InvalidPayment',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'bundler',
    outputs: [
      {
        internalType: 'contract IBundler',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'extraStorage',
        type: 'uint256',
      },
    ],
    name: 'fee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feePercentage',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'extraStorage',
        type: 'uint256',
      },
    ],
    name: 'price',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'recovery',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'sig',
            type: 'bytes',
          },
        ],
        internalType: 'struct IBundler.RegistrationParams',
        name: 'registration',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'keyType',
            type: 'uint32',
          },
          {
            internalType: 'bytes',
            name: 'key',
            type: 'bytes',
          },
          {
            internalType: 'uint8',
            name: 'metadataType',
            type: 'uint8',
          },
          {
            internalType: 'bytes',
            name: 'metadata',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'sig',
            type: 'bytes',
          },
        ],
        internalType: 'struct IBundler.SignerParams[]',
        name: 'signers',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: 'extraStorage',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'extraWei',
        type: 'uint256',
      },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: '_feePercentage',
        type: 'uint8',
      },
    ],
    name: 'setFeePercentage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export function useGifterContract(chainId: number | undefined) {
  const optimismAddr = '0xf4156782fbfa7d35A0Ed822d6666788BF95047B9' as Address
  const hardhatAddr = '0x922d6956c99e12dfeb3224dea977d0939758a1fe' as Address

  return useMemo(
    () => ({
      address: chainId === hardhat.id ? hardhatAddr : optimismAddr,
      abi,
    }),
    [chainId]
  )
}
