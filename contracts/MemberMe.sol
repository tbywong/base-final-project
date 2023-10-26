// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MemberMe is ERC721URIStorage, Ownable {
    error PlanAlreadyExists();
    error PlanIdNotFound(uint);
    error PriceCannotBeZero();
    error IncorrectAmountSent(uint, uint);
    error NotAllowed();

    struct Plan {
        uint id;
        uint price;
        string name;
        string tokenURI;
        // stretch: recurringPeriod { monthly, annually, etc }
    }
    Plan[] private _plans;
    mapping(uint => Plan) private _planData;

    enum MembershipStatus {
        Active,
        Deactivated,
        Expired
    }

    struct Membership {
        address owner;
        MembershipStatus status;
        uint planId;
        uint tokenId;
        uint createdAt;
        uint lastRenewedAt;
    }
    struct MembershipPublic {
        address owner;
        MembershipStatus status;
        uint tokenId;
        string tokenURI;
        string planName;
    }
    mapping(uint => Membership) private _memberships;
    mapping(address => Membership) private _addrMemberships;

    uint private _tokenCounter;
    address private _admin;

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner
    ) ERC721(_name, _symbol) Ownable(_owner) {
        _admin = _owner;
        _tokenCounter = 0;
    }

    function getAdmin() external view returns (address) {
        return _admin;
    }

    function createPlan(
        string memory _name,
        string memory _tokenURI,
        uint _price
    ) external onlyOwner returns (Plan memory) {
        for (uint8 i = 0; i < _plans.length; i++) {
            if (
                keccak256(abi.encodePacked(_plans[i].name)) ==
                keccak256(abi.encodePacked(_name))
            ) {
                revert PlanAlreadyExists();
            }
        }

        if (_price == 0) {
            revert PriceCannotBeZero();
        }

        uint planId = _plans.length + 1;
        Plan memory plan = Plan(planId, _price, _name, _tokenURI);
        _plans.push(plan);
        _planData[planId] = plan;

        return plan;
    }

    function getAllPlans() external view returns (Plan[] memory) {
        return _plans;
    }

    function mintMembership(uint _planId) external payable {
        if (_planId > _plans.length) {
            revert PlanIdNotFound(_planId);
        }

        Plan memory currentPlan = _planData[_planId];
        if (msg.value != currentPlan.price) {
            revert IncorrectAmountSent(msg.value, currentPlan.price);
        }

        _tokenCounter++;
        _safeMint(msg.sender, _tokenCounter);
        _setTokenURI(_tokenCounter, currentPlan.tokenURI);

        Membership memory newMembership = Membership(
            msg.sender,
            MembershipStatus.Active,
            currentPlan.id,
            _tokenCounter,
            block.timestamp,
            0
        );

        _memberships[_tokenCounter] = newMembership;
        _addrMemberships[msg.sender] = newMembership;
    }

    function renewMembership(
        uint _tokenId,
        uint _currentTime
    ) external payable {
        if (msg.sender != ownerOf(_tokenId)) {
            revert NotAllowed();
        }

        Membership storage mem = _memberships[_tokenId];
        Membership storage addrMem = _addrMemberships[msg.sender];

        uint price = _planData[mem.planId].price;

        if (msg.value != price) {
            revert IncorrectAmountSent(msg.value, price);
        }

        mem.lastRenewedAt = _currentTime;
        mem.status = MembershipStatus.Active;
        addrMem.lastRenewedAt = _currentTime;
        addrMem.status = MembershipStatus.Active;
    }

    function cancelMembership(uint _tokenId) external {
        if (msg.sender != ownerOf(_tokenId)) {
            revert NotAllowed();
        }

        _burn(_tokenId);

        _memberships[_tokenId].status = MembershipStatus.Deactivated;
        _addrMemberships[msg.sender].status = MembershipStatus.Deactivated;
    }

    function getMembership() external view returns (MembershipPublic memory) {
        Membership memory mem = _addrMemberships[msg.sender];
        Plan memory plan = _planData[mem.planId];
        MembershipPublic memory memPub = MembershipPublic(
            mem.owner,
            mem.status,
            mem.tokenId,
            tokenURI(mem.tokenId),
            plan.name
        );
        return memPub;
    }

    function getAllMemberships()
        external
        view
        onlyOwner
        returns (Membership[] memory)
    {
        Membership[] memory allMems = new Membership[](_tokenCounter);
        for (uint8 i = 0; i < _tokenCounter; i++) {
            allMems[i] = _memberships[i + 1];
        }
        return allMems;
    }

    function expireMembership(uint _tokenId) external onlyOwner {
        Membership storage mem = _memberships[_tokenId];
        Membership storage addrMem = _addrMemberships[msg.sender];
        mem.status = MembershipStatus.Expired;
        addrMem.status = MembershipStatus.Expired;
    }
}
