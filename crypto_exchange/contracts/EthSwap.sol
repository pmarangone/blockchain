//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public rate = 100;

    event TokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );
    event TokensSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Redemption rate = # of tokens they receive for 1 ether
        // Amount of Ethererum * Redemption rate
        // Calculate the number of tokens to buy
        uint256 tokenAmount = msg.value * rate;

        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public payable {
        // user can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);

        // calculate the amount of ether to redeem
        uint256 etherAmount = _amount / rate;

        require(address(this).balance >= etherAmount);
        // perfom sale
        // transferFrom exists in every ECR20
        // allowing contracts to expend in your behalf
        token.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);

        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}
