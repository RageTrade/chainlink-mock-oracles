import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";

const coin = "USDT";
const oracleName = coin + "Oracle";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;

  const { deployer } = await getNamedAccounts();

  await deploy(oracleName, {
    contract: "ChainlinkMockOracle",
    from: deployer,
    log: true,
    args: [coin, ethers.utils.parseUnits("1", 8)],
  });
};

export default func;

func.tags = [oracleName];
