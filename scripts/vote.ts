const index = 0;
import { developmentChains, GOVERNOR_ADDRESS, PROPOSALS_JSON, VOTING_DELAY } from "../helper-hardhat-config";
import * as fs from "fs";
import { ethers, network } from "hardhat";
import { Contract } from "ethers";
import { moveBlocks } from "../utils/move-blocks";

export async function vote(proposalIndex: number) {
    // read index from PROPOSALS_JSON
    const proposals = JSON.parse(fs.readFileSync(PROPOSALS_JSON, "utf8"));
    const proposalId = proposals[network.config.chainId!.toString()][proposalIndex];
    // 0 = agains, 1 = for, 2 = abstain
    const voteWay = 1;
    const governorContract: Contract = await ethers.getContractAt("SlcDaoGovernor", GOVERNOR_ADDRESS);
    const voteTxResponse = await governorContract.castVoteWithReason(proposalId, voteWay, "Reason: testing");
    await voteTxResponse.wait(1);

    // we're moving blocks along because we want to get to the end of voting period (for "testing" to see the proposal state)
    if (developmentChains.includes(network.name)) {
        moveBlocks(VOTING_DELAY + 1);
    }
    console.log("Vote casted");
    const proposalState = await governorContract.state(proposalId);
    console.log("The state of the proposal is: ", proposalState); // check IGovernorUpgradable.sol to see what states mean
}

vote(index).then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});