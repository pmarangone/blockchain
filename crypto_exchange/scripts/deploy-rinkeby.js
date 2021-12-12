async function main() {
  const Token = await ethers.getContractFactory("Token");

  // Start Token deployment, returning a promise that resolves to a contract object
  const token = await Token.deploy();
  console.log("Token contract deployed to address:", token.address);

  const EthSwap = await ethers.getContractFactory("EthSwap");

  // Start deployment, returning a promise that resolves to a contract object
  const ethSwap = await EthSwap.deploy(token.address);
  console.log("EthSwap contract deployed to address:", ethSwap.address);

  await token.transfer(ethSwap.address, "1000000000000000000000000");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
