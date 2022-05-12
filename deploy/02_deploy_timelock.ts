import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MIN_DELAY } from "../helper-hardhat-config";

const deployTimelock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const timeLock = await deploy("SlcDaoTimelock", {
        from: deployer,
        args: [MIN_DELAY, [], []],
        log: true
    });
};

export default deployTimelock;