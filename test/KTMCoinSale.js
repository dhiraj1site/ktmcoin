var KTMCoinSale = artifacts.require('./KTMCoinSale');

contract('KTMCoinSale', function(accounts) {

    var coinPrice = 100; //0.001 eth, in wei 

    it('initalizes the contract with the correct values', async function() {
        var coinSaleInstance = await KTMCoinSale.deployed();

        var coinSaleAddress = coinSaleInstance.address;

        assert.notEqual(coinSaleAddress, 0x0, 'the contact has an address');

        var _ = await coinSaleInstance.tokenContract();

        assert.notEqual(_, 0x0, 'has a contract address');

        var price = await coinSaleInstance.coinPrice();

        assert.equal(price, coinPrice, 'has a coin price');
    })
})