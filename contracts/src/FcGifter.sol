// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IBundler} from "./interfaces/IBundler.sol";

contract FcGifter is Ownable {
    /* ERRORS */
    error InvalidPayment();

    /* CONSTANTS */
    uint8 public feePercentage;
    address public constant old = 0x56184a5627523F2062De73f3ac5754e6FC7cc328;

    /* IMMUTABLES */
    IBundler public immutable bundler;

    /* CONSTRUCTOR */
    constructor(
        uint8 _feePercentage,
        address _initialOwner,
        address _bundlerAddress
    ) Ownable(_initialOwner) {
        feePercentage = _feePercentage;
        bundler = IBundler(_bundlerAddress);
    }

    /**
     * @notice Register an fid, multiple signers, and rent storage to an address in a single transaction.
     *
     * @param registration Struct containing registration parameters: to, recovery, deadline, and signature.
     * @param signers      Array of structs containing signer parameters: keyType, key, metadataType, metadata, deadline, and signature.
     * @param extraStorage Number of extra storage units to rent.
     * @param extraWei     Amount of wei to transfer for the purpose of covering future gas gosts.
     *
     */
    function register(
        IBundler.RegistrationParams calldata registration,
        IBundler.SignerParams[] calldata signers,
        uint256 extraStorage,
        uint256 extraWei
    ) external payable {
        // Check that the payment covers the base price + fee + extraWei
        if (msg.value < (this.price(extraStorage) + extraWei)) {
            revert InvalidPayment();
        }

        // Transfer `extraWei` to the recipient
        payable(registration.to).transfer(extraWei);

        // Send the base fee to the bundler for account registration
        // This will leave the fee (and overpayment), adding it to the contract's balance
        bundler.register{value: bundler.price(extraStorage)}(registration, signers, extraStorage);
    }

    /**
     * @notice Calculate the cost in wei to rent the given number of storage units.
     *
     * @param extraStorage Number of extra storage units.
     * @return uint256     Cost in wei.
     *
     */
    function price(uint256 extraStorage) external view returns (uint256) {
        return bundler.price(extraStorage) + this.fee(extraStorage);
    }

    /**
     * @notice The wei added to each registration
     *
     * @param extraStorage Number of extra storage units.
     * @return uint256     Cost in wei.
     *
     */
    function fee(uint256 extraStorage) external view returns (uint256) {
        return (bundler.price(extraStorage) * feePercentage) / 100;
    }

    /**
     * @notice Set the fee percentage.
     *
     * @param _feePercentage New fee percentage.
     *
     */
    function setFeePercentage(uint8 _feePercentage) external onlyOwner {
        feePercentage = _feePercentage;
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
