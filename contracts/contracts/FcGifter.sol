// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";

import {IBundler} from "./interfaces/IBundler.sol";
import {IStorageRegistry} from "./interfaces/IStorageRegistry.sol";

contract FcGifter is Ownable {
    /* ERRORS */
    error InvalidPayment();

    /* CONSTANTS */
    uint8 public extraFee;

    /* IMMUTABLES */
    IBundler public immutable bundler;
    IStorageRegistry public immutable storageRegistry;

    /* CONSTRUCTOR */
    constructor(
        uint8 _extraFee,
        address _initialOwner,
        address _bundlerAddress,
        address _storageRegistryAddress
    ) Ownable(_initialOwner) {
        extraFee = _extraFee;
        bundler = IBundler(_bundlerAddress);
        storageRegistry = IStorageRegistry(_storageRegistryAddress);
    }

    /**
     * @notice Register an fid, multiple signers, and rent storage to an address in a single transaction.
     *
     * @param registration Struct containing registration parameters: to, recovery, deadline, and signature.
     * @param signers      Array of structs containing signer parameters: keyType, key, metadataType,
     *                        metadata, deadline, and signature.
     * @param storageUnits Number of storage units to rent
     * @param extraEth     Amount of extra ETH to send to cover gas costs.
     *
     */
    function register(
        IBundler.RegistrationParams calldata registration,
        IBundler.SignerParams[] calldata signers,
        uint256 storageUnits,
        uint256 extraEth
    ) external payable {
        uint256 totalPrice = this.price(storageUnits);
        if (msg.value < totalPrice) revert InvalidPayment();

        bundler.register(registration, signers, storageUnits);
        payable(registration.to).transfer(extraEth);
    }

    /**
     * @notice Calculate the cost in wei to rent the given number of storage units.
     *
     * @param units Number of storage units.
     * @return uint256 cost in wei.
     *
     */
    function price(uint256 units) external view returns (uint256) {
        uint256 basePrice = storageRegistry.price(units);
        return basePrice + (basePrice * extraFee) / 100;
    }

    /**
     * @notice Withdraw all funds from the contract.
     *
     */
    function withdraw() external onlyOwner {
        address payable recipient = payable(owner());
        uint256 balance = address(this).balance;
        recipient.transfer(balance);
    }
}
