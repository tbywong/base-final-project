import { ethers, getNamedAccounts } from "hardhat";

async function main() {
  // const { deployer, owner } = await getNamedAccounts();

  const factory = await ethers.deployContract("MemberMeFactory");
  await factory.waitForDeployment();

  console.log(`MemberMe deployed to ${factory.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
