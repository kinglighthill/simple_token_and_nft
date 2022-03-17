// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleToken is ERC20 {
    uint256 constant _initialSupply = 1000000;
    uint256 constant _ethTokenRate = 1000;

    constructor() ERC20("King", "KNT") {
        _mint(msg.sender, convertToDecimal(_initialSupply));
    }

    function buyToken(address receiver) public payable {
        uint256 tokens = msg.value * _ethTokenRate;
        _mint(receiver, tokens);
    }

    function convertToDecimal(uint256 value) private view returns (uint256) {
        return value * 10 ** decimals();
    }
}