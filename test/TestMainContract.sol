// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "../contracts/MainContract.sol";

contract TestMainContract {
    function testCreateElection() public {
        MainContract mainContract = new MainContract();
        string[] memory nda = new string[](2);
        nda[0] = "US Election";
        nda[1] = "US presidential election";
        string[] memory candidates = new string[](2);
        candidates[0] = "Satoshi";
        candidates[1] = "Bush";
        mainContract.createElection(nda, candidates);

        Assert.equal(mainContract.electionId(), 1, "'electionId' must be 1");
    }
}
