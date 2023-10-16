import { Address } from 'viem'

export function truncateAddress(address: Address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const copyToClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
