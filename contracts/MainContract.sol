// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./Election.sol";

contract MainContract {
    uint256 public electionId = 0;
    mapping(uint256 => address) public Elections;

    function createElection(string[] memory _nda, string[] memory _candidates)
        public
    {
        Election election = new Election(_nda, _candidates);
        Elections[electionId] = address(election);
        electionId++;
    }
}
