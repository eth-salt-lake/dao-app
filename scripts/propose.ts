import { Contract } from "ethers";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";
import { developmentChains, PROPOSAL_DESCRIPTION, PROPOSAL_FUNCTION, VOTING_DELAY, PROPOSALS_JSON, GOVERNOR_ADDRESS } from "../helper-hardhat-config";
// propose on governor contract
export async function propose(args: any[], functionToCall: string) {
    // const governor = await ethers.getContract("SlcDaoGovernor");
    const governorContract: Contract = await ethers.getContractAt("SlcDaoGovernor", GOVERNOR_ADDRESS);
    const daoTopicsContract = await ethers.getContract("SlcDaoTopics");

    // propose on governor contract by calling on SlcDaoTopics function addPassedProposal)
    const encodedFunctionCall = daoTopicsContract.interface.encodeFunctionData(
        functionToCall,
        args
    );

    console.log(encodedFunctionCall);
    const proposeTx = await governorContract.propose(
        [daoTopicsContract.address],
        [0],
        [encodedFunctionCall],
        PROPOSAL_DESCRIPTION,
    )
    const proposeReceipt = await proposeTx.wait(1);

    // with voting delay we need to pass time artificially (for testing purposes)
    if (developmentChains.includes(network.name)) {
        // move the blocks forwards, since no mining on local env.
        await moveBlocks(VOTING_DELAY + 1);
    }
    const proposalId = proposeReceipt.events[0].args.proposalId;
    const proposalDescription = proposeReceipt.events[0].args.description;

    console.log('proposal id: ', proposalId, proposalDescription);

    // we need to save the proposalId for other scripts to be able to vote
    let proposals = JSON.parse(fs.readFileSync(PROPOSALS_JSON, "utf8"));
    const proposalChains = proposals[network.config.chainId!.toString()];
    if (!proposalChains) {
        proposals[network.config.chainId!.toString()] = [];
    }
    proposals[network.config.chainId!.toString()].push(proposalId.toString());
    fs.writeFileSync(PROPOSALS_JSON, JSON.stringify(proposals));
}

const hashedDescription = ethers.utils.id(PROPOSAL_DESCRIPTION);

propose([hashedDescription], PROPOSAL_FUNCTION).then(() => { process.exit(0) })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });