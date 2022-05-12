// queue is Governor Timelock contract and it does exactly the same as propose, except it queues the proposal

import { Contract } from "ethers";
import { ethers, network } from "hardhat";
import { developmentChains, GOVERNOR_ADDRESS, MIN_DELAY, PROPOSAL_DESCRIPTION, PROPOSAL_FUNCTION } from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import { moveTime } from "../utils/move-time";

export async function queueAndExecute() {
    const daoTopicsContract = await ethers.getContract("SlcDaoTopics");

    const hashedDescription = ethers.utils.id(PROPOSAL_DESCRIPTION);

    console.log("hashed description:", hashedDescription);
    const args = [hashedDescription];

    // propose on governor contract by calling on SlcDaoTopics function addPassedProposal)
    const encodedFunctionCall = daoTopicsContract.interface.encodeFunctionData(
        PROPOSAL_FUNCTION,
        args
    );

    const governorContract: Contract = await ethers.getContractAt("SlcDaoGovernor", GOVERNOR_ADDRESS);
    console.log("Queueing proposal...");
    const queueTx = await governorContract.queue(
        [daoTopicsContract.address],
        [0],
        [encodedFunctionCall],
        hashedDescription
    );

    await queueTx.wait(1);

    // we still have to wait min delay to be able to execute the proposal
    // so we speed up minting on localhost
    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1);
        await moveBlocks(1);
    }

    console.log("Executing proposal...");
    const executeTx = await await governorContract.execute(
        [daoTopicsContract.address],
        [0],
        [encodedFunctionCall],
        hashedDescription
    );
    await executeTx.wait(1);

    console.log("Proposal executed!");

    const isObserved = await daoTopicsContract.getPassedProposal(hashedDescription);
    // should be false since we just executed the proposal
    console.log("executed proposal is added but not yet observed by a manager: ", isObserved);
}


queueAndExecute().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});