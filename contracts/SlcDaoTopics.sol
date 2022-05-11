//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SlcDaoTopics is Ownable, AccessControl {
    // all observed proposal descriptions (each hashed description is firstly false (unobserved))
    mapping(bytes32 => bool) public observables;

    event LogObservedProposal(address manager, bytes32 hashedDescription);

    // role confirmator means managers of the contract to say certain proposal was executed
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    // assign roles to all init managers
    constructor(address[] memory _managers) {
        // owner of the contract is default admin
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        for (uint256 i = 0; i < _managers.length; ++i) {
            _setupRole(MANAGER_ROLE, _managers[i]);
        }
    }

    // only owner can add a manager
    function addManager(address _manager) public onlyOwner {
        _grantRole(MANAGER_ROLE, _manager);
    }

    // removes a manager from the list of managers
    function removeManager(address _manager) public onlyOwner {
        revokeRole(MANAGER_ROLE, _manager);
    }

    // adds a proposal id to the list of observed proposals
    function addPassedProposal(bytes32 _hashedDescription) public onlyOwner {
        observables[_hashedDescription] = false;
    }

    function getPassedProposal(bytes32 _hashedDescription)
        public
        view
        returns (bool)
    {
        return observables[_hashedDescription];
    }

    // marks the observed proposal as observed (it can only be marked as observed once)
    function markProposalAsObserved(bytes32 _hashedDescription) public {
        // check that this is one of the managers
        require(hasRole(MANAGER_ROLE, msg.sender), "not allowed");
        observables[_hashedDescription] = true;
        emit LogObservedProposal(msg.sender, _hashedDescription);
    }
}
