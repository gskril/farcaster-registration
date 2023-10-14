# Gift a Farcaster Account

There are two relevant onchain components of a Farcaster account: FID (free) and storage ($7 in ETH). We want to provide an easy way for people to gift both of these to others.

The [IDRegistry](https://optimistic.etherscan.io/address/0x00000000fcaf86937e41ba038b4fa40baa4b780a) doesn't allow FIDs to be transferred freely - the sender is required to have the receivers signature. This app provides an easy way to faciliate that process.

Flow:

- Alice signs a message, effectively creating a request for someone to sponsor their registration fee
  - This is stored in Vercel KV with Alice's address as the key and the stringified signature/deadline as the value
- Bob enters the URL `/sponsor/{address}` which pulls the necessary signature from KV storage and prepares [Bundler](https://optimistic.etherscan.io/address/0x00000000fc94856f3967b047325f88d47bc225d0) transaction

## Getting Started

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
