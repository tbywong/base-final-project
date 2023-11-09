import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers"
import "hardhat-deploy"
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  namedAccounts: {
    deployer: 0, // wallet number 0 is deployer
    owner: "0x40911E2Ab44E9bDcAa1837169482fD6bC9c36144"
  },
  paths: {
    artifacts: './artifacts'
  },
  networks: {
    // hardhat: {
    //   chainId: 1337
    // },
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337
    },
    base_goerli: {
      url: "https://goerli.base.org",
      accounts: {
        mnemonic: process.env.MNEMONIC ?? ""
      },
      verify: {
        etherscan: {
          apiUrl: "https://api-goerli.basescan.org",
          apiKey: process.env.ETHERSCAN_API_KEY ?? "ETHERSCAN_API_KEY"
        }
      }
    }
  },
  etherscan: {
    apiKey: {
      baseGoerli: "ETHERSCAN_API_KEY"
    }
  }
};

export default config;
