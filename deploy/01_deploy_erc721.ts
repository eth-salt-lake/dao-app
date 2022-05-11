import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    // TODO: add waitConfirmations (for deploy to testnet or mainnet)
    const governanceToken = await deploy("SlcDaoErc721", { from: deployer, args: [], log: true });
    log("Governance Token deployed at ", governanceToken.address);

    await delegate(governanceToken.address, deployer);
    log("Delegated to deployer");
}

// deletegate ownership of the governance token to the account
// basically answering: who do we want to be able to vote with their token
const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
    const governanceToken = await ethers.getContractAt("SlcDaoErc721", governanceTokenAddress);
    const tx = await governanceToken.delegate(delegatedAccount);
    await tx.wait(1);
    // 
    console.log('delegated governance token to', delegatedAccount);
    // console.log(`Voting units available ${await governanceToken._getVotingUnits(delegatedAccount)}`);
};

export default deployGovernanceToken;