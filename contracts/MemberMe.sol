// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract MemberMe is ERC721URIStorage, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    error PlanNameAlreadyExists(string);
    error PlanIdNotFound(uint);
    error PriceCannotBeZero();
    error IncorrectAmountSent(uint, uint);
    error NotAllowed();

    enum MembershipStatus {
        Active,
        Deactivated,
        Expired
    }

    struct Plan {
        uint id;
        uint price;
        string name;
        string tokenURI;
    }

    struct Membership {
        address owner;
        MembershipStatus status;
        uint planId;
        uint tokenId;
        uint createdAt;
        uint lastRenewedAt;
        string tokenURI;
    }

    uint private _tokenCounter;
    Plan[] private _plans;
    mapping(uint => Plan) private _plansMap;
    mapping(address => Membership) private _memberships;
    EnumerableSet.AddressSet private _tokenHolders;

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner
    ) ERC721(_name, _symbol) Ownable(_owner) {
        _tokenCounter = 0;
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
                revert PlanNameAlreadyExists(_name);
            }
        }

        if (_price == 0) {
            revert PriceCannotBeZero();
        }

        uint planId = _plans.length + 1;
        Plan memory plan = Plan(planId, _price, _name, _tokenURI);
        _plans.push(plan);
        _plansMap[planId] = plan;

        return plan;
    }

    function getAllPlans() external view returns (Plan[] memory) {
        return _plans;
    }

    function mintMembership(uint _planId) external payable {
        if (_planId > _plans.length) {
            revert PlanIdNotFound(_planId);
        }

        Plan memory plan = _plansMap[_planId];
        if (msg.value != plan.price) {
            revert IncorrectAmountSent(msg.value, plan.price);
        }

        _tokenCounter++;
        _safeMint(msg.sender, _tokenCounter);
        _setTokenURI(_tokenCounter, plan.tokenURI);
        _tokenHolders.add(msg.sender);

        _memberships[msg.sender] = Membership(
            msg.sender,
            MembershipStatus.Active,
            plan.id,
            _tokenCounter,
            block.timestamp,
            0,
            tokenURI(_tokenCounter)
        );
    }

    function renewMembership(
        uint _tokenId,
        uint _currentTime
    ) external payable {
        if (msg.sender != ownerOf(_tokenId)) {
            revert NotAllowed();
        }

        Membership storage membership = _memberships[msg.sender];
        uint price = _plans[membership.planId - 1].price;

        if (msg.value != price) {
            revert IncorrectAmountSent(msg.value, price);
        }

        membership.lastRenewedAt = _currentTime;
        membership.status = MembershipStatus.Active;
    }

    function cancelMembership(uint _tokenId) external {
        if (msg.sender != ownerOf(_tokenId)) {
            revert NotAllowed();
        }

        _burn(_tokenId);
        _memberships[msg.sender].status = MembershipStatus.Deactivated;
    }

    function getMembership() external view returns (Membership memory) {
        return _memberships[msg.sender];
    }

    function getAllMemberships()
        external
        view
        onlyOwner
        returns (Membership[] memory)
    {
        Membership[] memory memberships = new Membership[](
            _tokenHolders.length()
        );
        for (uint8 i = 0; i < _tokenCounter; i++) {
            memberships[i] = _memberships[_tokenHolders.at(i)];
        }
        return memberships;
    }

    function expireMembership(uint _tokenId) external onlyOwner {
        address membershipOwner = ownerOf(_tokenId);
        Membership storage membership = _memberships[membershipOwner];
        membership.status = MembershipStatus.Expired;
    }
}
