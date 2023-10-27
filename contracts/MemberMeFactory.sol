// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {MemberMe} from "./MemberMe.sol";

contract MemberMeFactory {
    address[] public contractAddresses;
    event ContractCreated(address indexed newContractAddress);

    function createContract(
        string memory _name,
        string memory _symbol
    ) external returns (address) {
        MemberMe newContract = new MemberMe(_name, _symbol, msg.sender);
        contractAddresses.push(address(newContract));

        emit ContractCreated(address(newContract));

        return address(newContract);
    }

    function getContractAddresses() external view returns (address[] memory) {
        return contractAddresses;
    }
}
