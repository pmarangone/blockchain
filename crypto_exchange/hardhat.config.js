require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

/* running on localhost */

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
  },
};

/* running on rinkeby network */

// const { API_URL, PRIVATE_KEY } = process.env;
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// module.exports = {
//   solidity: "0.8.0",
//   defaultNetwork: "rinkeby",
//   networks: {
//     hardhat: {},
//     rinkeby: {
//       url: API_URL,
//       accounts: [`0x${PRIVATE_KEY}`],
//     },
//   },
//   etherscan: {
//     apiKey: ETHERSCAN_API_KEY,
//   },
// };
