# Gift a Farcaster Account

There are two relevant onchain components of a Farcaster account: FID (free) and storage ($7 in ETH). We want to provide an easy way for people to gift both of these to others.

The [IDRegistry](https://optimistic.etherscan.io/address/0x00000000fcaf86937e41ba038b4fa40baa4b780a) doesn't allow FIDs to be transferred freely - the sender is required to have the receivers signature. This app provides an easy way to faciliate that process.

Flow:

- Alice signs a message, effectively creating a request for someone to sponsor their registration fee
  - This is stored in Vercel KV with Alice's address as the key and the stringified signature/deadline as the value
- Bob enters the URL `/sponsor/{address}` which pulls Alice's signature from KV storage and prepares a transaction on the [FcGifter.sol](./contracts/README.md) contract
