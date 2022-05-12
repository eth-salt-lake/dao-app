import { GOVERNOR_ADDRESS, PROPOSALS_JSON } from "../helper-hardhat-config";
import * as fs from "fs";
import { ethers, getNamedAccounts, network } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { EthereumProvider } from "hardhat/types";

const index = 0;


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
    const userVotesTwo = await governorContract.getVotes(managerTwo, 15); // managerTwo is the voter
    const userVotes = await governorContract.getVotes(manager, 15);
    const state = await governorContract.state(proposalId);

    console.log(`Voter: ${managerTwo} with votes: ${userVotes.toString()};`);
    console.log(`Voter: ${manager} with votes: ${userVotes.toString()};`);
    console.log(`contract at state: ${ProposalState[+state.toString()]}`);
};

state(index).then(() => { process.exit(0) })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });