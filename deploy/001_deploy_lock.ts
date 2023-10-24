import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  // Constants for deployment
  const CONTRACT_NAME = "Test Membership";
  const CONTRACT_SYMBOL = "TST";

  await deploy("MemberMe", {
    from: deployer,
    args: [CONTRACT_NAME, CONTRACT_SYMBOL, deployer]
  });

};

export default func;

// This tag will help us in the next section to trigger this deployment file programmatically 
func.tags = ["DeployAll"];