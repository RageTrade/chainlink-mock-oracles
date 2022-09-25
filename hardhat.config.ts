import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";

import { ethers } from "ethers";
import { config as loadEnv } from "dotenv";
loadEnv();

const pk =
  process.env.PRIVATE_KEY || ethers.utils.hexlify(ethers.utils.randomBytes(32));

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    arbtest: {
      url: `https://rinkeby.arbitrum.io/rpc`,
      accounts: [pk],
      chainId: 421611,
    },
    arbgoerli: {
      url: `https://goerli-rollup.arbitrum.io/rpc`,
      accounts: [pk],
      chainId: 421613,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
