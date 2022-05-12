// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (governance/TimelockController.sol)

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract SlcDaoTimelock is TimelockController {
    // minDelay: how long to wait before executing
    // proposers: is the list of addresses that can propose
    // executors: who can execute when a proposal passes
    constructor(
        uint256 minDelay,
        address[] memory proposers, // should be only the TimeLock contract
        address[] memory executors // anyone can be an executor
    ) TimelockController(minDelay, proposers, executors) {}
}
