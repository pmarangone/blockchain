const { assert } = require("chai");
const { ethers } = require("hardhat");

require("chai").use(require("chai-as-promised")).should();

// throws error
// function tokens(n) {
//   return web3.utils.toWei(n, "ether");
// }

function tokens2(n) {
  let value = ethers.utils.parseEther(n);
  return value.toString();
}

const provider = new ethers.providers.JsonRpcProvider();

describe("EthSwap", () => {
  let token, EthSwap, ethSwap;
  let Token, owner, investor;

  before(async () => {
    [owner, investor, _] = await ethers.getSigners();

    Token = await ethers.getContractFactory("Token");
    EthSwap = await ethers.getContractFactory("EthSwap");

    token = await Token.deploy();
    ethSwap = await EthSwap.deploy(token.address);

    await token.transfer(ethSwap.address, tokens2("1000000"));
  });

  describe("Token deployment", async () => {
    it("contract has a name", async () => {
      const name = await token.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });
    it("contract has tokens2", async () => {
      let balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens2("1000000"));
    });
  });

  describe("buyTokens()", async () => {
    let result;
    before(async () => {
      result = await ethSwap.connect(investor).buyTokens({
        from: investor.address,
        value: tokens2("1"),
      });
    });

    it("Allows user to instantly purchase tokens2 from ethSwap for a fixed price", async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor.address);
      assert.equal(investorBalance.toString(), tokens2("100"));

      // check ethSwap balance after purchase
      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens2("999900"));
      ethSwapBalance = await provider.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens2("1"));
    });
  });

  describe("sellTokens()", async () => {
    let result;

    before(async () => {
      // investor must approve tokens2 before the purchase
      await token.connect(investor).approve(ethSwap.address, tokens2("100"), {
        from: investor.address,
      });
      // investor sells tokens2
      result = await ethSwap.connect(investor).sellTokens(tokens2("100"), {
        from: investor.address,
      });
    });

    it("Allows user to instantly purchase tokens2 from ethSwap for a fixed price", async () => {
      // check investor token balance after purchase
      let investorBalance = await token.balanceOf(owner.address);
      assert.equal(investorBalance.toString(), tokens2("0"));

      // check ethSwap balance after purchase
      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens2("1000000"));
      ethSwapBalance = await provider.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens2("0"));

      // failure: investor can't sell more tokens2 than they have
      await ethSwap.sellTokens(tokens2("100"), { from: investor.address })
        .should.be.rejected;
    });
  });
});
