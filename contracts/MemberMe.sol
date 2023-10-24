// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// import "hardhat/console.sol";

contract MemberMe is ERC721, Ownable {
    error PlanAlreadyExists();
    error PlanNotFound();
    error PriceCannotBeZero();
    error IncorrectAmountSent();
    error NotAllowed();

    struct Plan {
        string name;
        uint price;
        // stretch: recurring period: monthly, annually, etc.
    }
    Plan[] public plans;
    mapping(string => uint) public planPrices;

    enum MembershipStatus {
        Active,
        Deactivated,
        Expired
    }

    struct Membership {
        address owner;
        string planName;
        MembershipStatus status;
        uint createdAt;
        uint lastRenewedAt;
    }
    mapping(uint => Membership) public memberships;

    uint private _tokenCounter;

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner
    ) ERC721(_name, _symbol) Ownable(_owner) {
        _tokenCounter = 0;
    }

    function createPlan(
        uint _price,
        string memory _name
    ) external onlyOwner returns (Plan memory) {
        for (uint8 i = 0; i < plans.length; i++) {
            if (
                keccak256(abi.encodePacked(plans[i].name)) ==
                keccak256(abi.encodePacked(_name))
            ) {
                revert PlanAlreadyExists();
            }
        }

        if (_price == 0) {
            revert PriceCannotBeZero();
        }

        Plan memory plan = Plan(_name, _price);
        plans.push(plan);
        planPrices[_name] = _price;

        return plan;
    }

    function getAllPlans() external view returns (Plan[] memory) {
        return plans;
    }

    function createMembership(string memory _planName) external payable {
        if (msg.value != planPrices[_planName]) {
            revert IncorrectAmountSent();
        }

        if (planPrices[_planName] == 0) {
            revert PlanNotFound();
        }

        Membership memory newMembership = Membership(
            msg.sender,
            _planName,
            MembershipStatus.Active,
            block.timestamp,
            0
        );

        _tokenCounter++;
        _safeMint(msg.sender, _tokenCounter);
        memberships[_tokenCounter] = newMembership;
    }

    function renewMembership(
        uint _tokenId,
        uint _currentTime
    ) external payable {
        if (msg.sender != ownerOf(_tokenId)) {
            revert NotAllowed();
        }

        Membership storage mem = memberships[_tokenId];

        string memory plan = mem.planName;
        uint price = planPrices[plan];

        if (msg.value != price) {
            revert IncorrectAmountSent();
        }

        mem.lastRenewedAt = _currentTime;
    }

    function cancelMembership(uint _tokenId) external {
        if (msg.sender != ownerOf(_tokenId)) {
            revert NotAllowed();
        }

        _burn(_tokenId);

        memberships[_tokenId].status = MembershipStatus.Deactivated;
    }

    function getMembership(
        uint _tokenId
    ) external view returns (Membership memory) {
        if (msg.sender != ownerOf(_tokenId)) {
            revert NotAllowed();
        }

        return memberships[_tokenId];
    }

    function getAllMemberships()
        external
        view
        onlyOwner
        returns (Membership[] memory)
    {
        Membership[] memory allMems = new Membership[](_tokenCounter);
        for (uint8 i = 0; i < _tokenCounter; i++) {
            allMems[i] = memberships[i + 1];
        }
        return allMems;
    }

    function expireMembership(uint _tokenId) external onlyOwner {
        Membership storage mem = memberships[_tokenId];
        mem.status = MembershipStatus.Expired;
    }
}

contract MemberMeFactory {
    function createReMemberInstance(
        string memory _name,
        string memory _symbol
    ) public returns (address) {
        MemberMe newContract = new MemberMe(_name, _symbol, msg.sender);
        return address(newContract);
    }
}
