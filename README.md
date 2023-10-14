# Gift a Farcaster Account

There are two critical onchain elements to a Farcaster account: fid (free) and storage ($7 in ETH).

The IDRegistry smart contract don't allow you to freely transfer an fid - the sender is required to have the recipients approval via an EIP-712 typed message. This app provides an easy way to faciliate that process.

Flow:

- Alice signs a message which creates a request for someone to sponsor their registration fee
  - This is stored in Vercel KV with Alice's address as the key and the stringified signed message as the value
- Bob enters the URL `/sponsor/{address}` which has the `registerTo` transaction ready to go

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
