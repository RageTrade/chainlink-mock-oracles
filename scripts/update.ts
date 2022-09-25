import { parseUnits } from "ethers/lib/utils";
import hre, { deployments } from "hardhat";
import { ChainlinkMockOracle__factory } from "../typechain-types";
import fetch from "node-fetch";

async function main() {
  while (1) {
    console.log("Start");

    try {
      await updateOracleIfNecessary("BTC", async () => {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const json = await response.json();
        return json.bitcoin.usd;
      });

      await updateOracleIfNecessary("ETH", async () => {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const json = await response.json();
        return json.ethereum.usd;
      });

      await updateOracleIfNecessary("USDT", async () => {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd"
        );
        const json = await response.json();
        return json.tether.usd;
      });

      await updateOracleIfNecessary("CRV", async () => {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=curve-dao-token&vs_currencies=usd"
        );
        const json = await response.json();
        return json["curve-dao-token"].usd;
      });
    } catch (e) {
      console.error(e);
    }

    // wait for some time
    await new Promise((resolve) =>
      setTimeout(resolve, 40_000 + Math.floor(20_000 * Math.random()))
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function updateOracleIfNecessary(
  coin: string,
  api: () => Promise<number>
) {
  const deployment = await deployments.get(coin + "Oracle");
  const oracle = ChainlinkMockOracle__factory.connect(
    deployment.address,
    hre.ethers.provider.getSigner(0)
  );
  const decimals = 8; // oracle.decimals()
  const data = await oracle.latestRoundData();
  const time = now() - data.updatedAt.toNumber();
  if (now() - data.updatedAt.toNumber() > 60) {
    const result = await api();
    const answer = parseUnits(result.toFixed(decimals), decimals);
    const tx = await oracle.setData(answer);
    console.log(coin, tx.hash, result);
  } else {
    console.log(coin, "skipped", time);
  }
}

function now() {
  return Math.floor(Date.now() / 1000);
}
