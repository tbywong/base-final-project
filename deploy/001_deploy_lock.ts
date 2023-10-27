import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  const VALUE_LOCKED = hre.ethers.parseEther('0.01');

  await deploy("MemberMeFactory", {
    from: deployer,
    args: [],
    // value: VALUE_LOCKED.toString()
  })
};

export default func;

// This tag will help us in the next section to trigger this deployment file programmatically 
func.tags = ["DeployAll"];