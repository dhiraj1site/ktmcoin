const KTMCoin = artifacts.require("KTMCoin");
const KTMCoinSale = artifacts.require("KTMCoinSale");
const coinPrice = 100; //0.001 eth, in wei 

module.exports = async function (deployer) {
  await deployer.deploy(KTMCoin, 10000);
  return deployer.deploy(KTMCoinSale, KTMCoin.address, coinPrice);
};
