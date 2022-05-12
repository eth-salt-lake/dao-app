import { GOVERNOR_ADDRESS, PROPOSALS_JSON } from "../helper-hardhat-config";
import * as fs from "fs";
import { ethers, getNamedAccounts, network } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { EthereumProvider } from "hardhat/types";

const index = 1;


enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}

export async function state(proposalIndex: number) {

    const { managerTwo, manager } = await getNamedAccounts();

    // read index from PROPOSALS_JSON
    const proposals = JSON.parse(fs.readFileSync(PROPOSALS_JSON, "utf8"));
    const proposalId = proposals[network.config.chainId!.toString()][proposalIndex];

    console.log(`got proposal id: ${proposalId} at index ${proposalIndex}`);

    const governorContract: Contract = await ethers.getContractAt("SlcDaoGovernor", GOVERNOR_ADDRESS);
    const state = await governorContract.state(proposalId);
    const threshold = await governorContract.proposalThreshold();
    const currentProposalVotes = await governorContract.proposalVotes(proposalId);
    console.log(`current proposal votes: ${currentProposalVotes}`);

    console.log(`contract at state: ${ProposalState[+state.toString()]}, threshold: ${threshold.toString()}`);
};

state(index).then(() => { process.exit(0) })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });