import { expect } from "chai";
import { ethers, deployments } from "hardhat";

// A helper utility to get the timestamp
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

// We import this type to have our signers typed 
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// Types from typechain
import { MemberMe, MemberMe__factory } from '../typechain-types';

describe('MemberMe', function () {
  // Typechain allow us to type an instance of the Lock contract.
  let memberMeInstance: MemberMe;

  // This is the Signer of the owner.
  let ownerSigner: SignerWithAddress;

  // A non owner signed useful to test non owner transactions.
  let otherUserSigner: SignerWithAddress;

  before(async () => {
    // We get the latest block.timestamp using the latest function of time.
    // lastBlockTimeStamp = await time.latest();

    // Hardhat provide us with some sample signers that simulate Ethereum accounts.
    const signers = await ethers.getSigners();

    // We simply assign the first signer to ownerSigner
    ownerSigner = signers[0];

    // We assign the second signer to otherUserSigner
    otherUserSigner = signers[1];

    await deployments.fixture(['DeployAll']);
    const mmDeployment = await deployments.get('MemberMe');

    memberMeInstance = MemberMe__factory.connect(mmDeployment.address, ownerSigner);

    // NOTE: For testing without deploying
    // memberMeInstance = await new MemberMe__factory(ownerSigner).deploy('Test', 'TST', ownerSigner);
  });

  it('should set the correct name', async () => {
    expect(await memberMeInstance.name()).to.equal('Test Membership');
  });

  it('should set the correct symbol', async () => {
    expect(await memberMeInstance.symbol()).to.equal('TST');
  });

  it('should set the correct owner', async () => {
    expect(await memberMeInstance.owner()).to.equal(ownerSigner.address);
  });
});