import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";

const deploySlcDaoTopics: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer, manager, managerTwo } = await getNamedAccounts();
    log("Deploying SlcDaoTopics Contract");

    const slcDaoDeploy = await deploy("SlcDaoTopics", {
        from: deployer,
        args: [ // manager addresses array
            [manager, managerTwo],
        ],
        log: true
    });

    log("SlcDaoTopics deployed at ", slcDaoDeploy.address);

    // our account deployed SlcDaoTopics contract. We want to give control over to TimeLock
    const timeLock = await ethers.getContract("SlcDaoTimelock");
    // we need to transfer ownership to TimeLock
    const slcDaoTopicsContract = await ethers.getContractAt("SlcDaoTopics", slcDaoDeploy.address);
    const transferOwnerTx = await slcDaoTopicsContract.transferOwnership(timeLock.address); // transfer to TimeLock
    await transferOwnerTx.wait(1);

    //TODO:  waitConfirmatioin (for prod)
    //TODO:  verify (for prod)
    log("SlcDaoContracts deployed and ownership transfered to SlcDaoTimeLock contract");
}

export default deploySlcDaoTopics;