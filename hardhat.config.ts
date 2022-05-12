import { task } from "hardhat/config";
import de from "dotenv";

import '@typechain/hardhat';
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";
import "tsconfig-paths/register";


de.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address, await account.getBalance());
  }
});

export default {
  solidity: {
    version: "0.8.13",
    settings: { optimizer: { enabled: true } }
  },
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALC_KEY}`,
      accounts: [process.env.ACC_1, process.env.ACC_2]
    },
    hardhat: {
      chainId: 1337
    }
  },
  etherscan: {
    apiKey: process.env.ETHER_SCAN_KEY
  }
};
