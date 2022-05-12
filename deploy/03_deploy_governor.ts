import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployProxyOptions } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { DeployFunction } from "hardhat-deploy/types";
import { ADDRESS_ZERO, QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD } from "../helper-hardhat-config";
import "hardhat-deploy";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, upgrades } = hre;
    const { log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const governanceToken = await get("SlcDaoErc721");
    const timeLock = await get("SlcDaoTimelock");
    const tmeLockContract = await ethers.getContract("SlcDaoTimelock");

    const opts: DeployProxyOptions = {
        initializer: "initialize",
        kind: "uups",
    }

    log("Deploying Governor Contract");
    const governor = await ethers.getContractFactory("SlcDaoGovernor");
    const governorContract: Contract = await upgrades.deployProxy(governor, [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE
    ], opts);

    await governorContract.deployed();

    //TODO: verify (for prod)
    log("Governor deployed at ", governorContract.address);

    log("Setting up roles...");
    const proposerRole = await tmeLockContract.PROPOSER_ROLE();
    const executorRole = await tmeLockContract.EXECUTOR_ROLE();
    const adminRole = await tmeLockContract.TIMELOCK_ADMIN_ROLE();

    // governor is the only one that can do anything 
    const proposerTx = await tmeLockContract.grantRole(proposerRole, governorContract.address);
    await proposerTx.wait(1);

    // no one has the executor role (which means everybody can execute)
    const executorTx = await tmeLockContract.grantRole(executorRole, ADDRESS_ZERO);
    await executorTx.wait(1);

    // currently our deployer account own TimeLock controller (thats how we can do above lines)
    // now that we gave everybody acccess we want to revoke our role from timelock
    const revokeTx = await tmeLockContract.revokeRole(adminRole, deployer);
    await revokeTx.wait(1);

    // now noone can do anything without governance happening (except managers to mark it as observed)
};

export default deployGovernorContract;