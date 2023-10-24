import { ethers, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();

  const memberMe = await ethers.deployContract("MemberMe", ['Fan Club', 'FCB', deployer]);

  await memberMe.waitForDeployment();

  console.log(`MemberMe deployed to ${memberMe.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
