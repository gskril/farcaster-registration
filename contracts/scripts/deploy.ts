import hre from 'hardhat'

async function main() {
  const args = [
    10, // uint8 _feePercentage
    '0x179A862703a4adfb29896552DF9e307980D19285', // address _initialOwner
    '0x00000000FC04c910A0b5feA33b03E0447AD0B0aA', // address _bundlerAddress
  ]

  const contract = await hre.viem.deployContract('FcGifter', args)

  console.log(`Deployed FcGifter to ${contract.address}`)

  if (hre.network.name === 'optimism') {
    await hre.run('verify:verify', {
      address: contract.address,
      constructorArguments: args,
    })
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
