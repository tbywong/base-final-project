import { expect } from "chai";
import { ethers, deployments } from "hardhat";


// We import this type to have our signers typed 
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// Types from typechain
import { MemberMeFactory, MemberMeFactory__factory } from '../typechain-types';

describe('MemberMe', function () {
    // Typechain allow us to type an instance of the Lock contract.
    let factory: MemberMeFactory;

    // This is the Signer of the owner.
    let ownerSigner: SignerWithAddress;

    before(async () => {

        // Hardhat provide us with some sample signers that simulate Ethereum accounts.
        const signers = await ethers.getSigners();

        // We simply assign the first signer to ownerSigner
        ownerSigner = signers[0];

        await deployments.fixture(['DeployAll']);
        const MMFDeployment = await deployments.get('MemberMeFactory');

        factory = MemberMeFactory__factory.connect(MMFDeployment.address, ownerSigner);

        // NOTE: For testing without deploying
        // memberMeInstance = await new MemberMe__factory(ownerSigner).deploy('Test', 'TST', ownerSigner);
    });

    it('should return a contract address', async () => {
        const response = await factory.createContract('Fan Club', 'FCB')
        expect(response).to.not.be.null;
        // expect(response).to.be.a('string');
    });
});