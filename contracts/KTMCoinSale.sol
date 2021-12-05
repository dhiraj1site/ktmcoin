pragma solidity >=0.4.22 <0.9.0;
import "./KTMCoin.sol";

contract KTMCoinSale {
    address admin;
    KTMCoin public tokenContract;
    uint256 public coinPrice;

    constructor(KTMCoin _tokenContract, uint256 _coinPrice) {
        // assign an admin for sale
        admin = msg.sender;

        tokenContract = _tokenContract;
        coinPrice = _coinPrice;
        // gurkha coin connection

        // coin price

    }
}