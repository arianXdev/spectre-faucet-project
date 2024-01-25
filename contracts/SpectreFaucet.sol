// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISpectreToken {
    function transfer(
        address _to,
        uint256 _value
    ) external returns (bool success);

    function balanceOf(address account) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 amount);
}

contract SpectreFaucet {
    address payable owner;
    ISpectreToken public token;

    uint256 public withdrawlAmount = 100 * (10 ** 18);
    uint256 public lockTime = 2 minutes;

    mapping(address => uint256) nextAccessTime;

    event Withdrawl(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    constructor(address tokenAddress) payable {
        owner = payable(msg.sender);
        token = ISpectreToken(tokenAddress);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You're NOT the owner!");
        _;
    }

    function requestTokens() public {
        require(
            msg.sender != address(0),
            "Request must NOT originate from a zero address!"
        );
        require(
            token.balanceOf(address(this)) >= withdrawlAmount,
            "Insufficient balance in faucet for withdrawl request!"
        );
        require(
            block.timestamp >= nextAccessTime[msg.sender],
            "Insufficient time elapsed since last withdrawl - Try again later!"
        );

        nextAccessTime[msg.sender] = block.timestamp + lockTime;

        token.transfer(msg.sender, withdrawlAmount);
    }

    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function setWithdrawlAmount(uint256 amount) external onlyOwner {
        withdrawlAmount = amount * (10 ** 18);
    }

    function setLockTime(uint256 amount) external onlyOwner {
        lockTime = amount * 1 minutes;
    }

    function withdraw() external onlyOwner {
        token.transfer(msg.sender, token.balanceOf(address(this)));
        emit Withdrawl(msg.sender, token.balanceOf(address(this)));
    }
}
