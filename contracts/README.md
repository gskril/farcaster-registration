# FcGifter

A simple smart contract that registers Farcaster accounts via [the bundler](https://optimistic.etherscan.io/address/0x00000000fc94856f3967b047325f88d47bc225d0) with a few modifications:

- A 10% fee is added to the registration cost
- The `regster` function allows for a sender to transfer some additional ETH to a recipient so they don't have to worry about gas costs for the first (few) signers they create

## Getting Started

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env.local
```

Run a local fork of OP Mainnet:

```bash
npx hardhat dev
```

In another terminal window, deploy the FcGifter.sol contract to your local fork:

```bash
yarn run deploy:local
```

In a third terminal window, run the [web app](../web/README.md) and connect to `Localhost 8545` in MetaMask.

## Deployments

- OP Mainnet: [0x56184a5627523f2062de73f3ac5754e6fc7cc328](https://optimistic.etherscan.io/address/0x56184a5627523f2062de73f3ac5754e6fc7cc328)
