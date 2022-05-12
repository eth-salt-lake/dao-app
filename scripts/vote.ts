import { ADDRESS_ZERO, developmentChains, GOVERNOR_ADDRESS, PROPOSALS_JSON, VOTING_DELAY } from "../helper-hardhat-config";
import * as fs from "fs";
import { ethers, getNamedAccounts, network } from "hardhat";
import { Contract } from "ethers";
import { moveBlocks } from "../utils/move-blocks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const index = 1;

enum VoteType {
    Against,
    For,
    Abstain
}

export async function vote(proposalIndex: number) {

    const { managerTwo } = await getNamedAccounts();
    console.log("manager two address: ", managerTwo);
    const managerTwoSigner: SignerWithAddress = await ethers.getSigner(managerTwo);

    // delegate vote to one self (so no burning or minting tokens on vote)
    const erc721Contract: Contract = await ethers.getContract("SlcDaoErc721");
    const delegateReceiptTx = await erc721Contract.connect(managerTwoSigner).delegate(managerTwo);

    console.log(delegateReceiptTx.blockNumber);
    const blockNumber = parseInt(delegateReceiptTx.blockNumber);
    console.log("block number: ", blockNumber);

    // read index from PROPOSALS_JSON
    const proposals = JSON.parse(fs.readFileSync(PROPOSALS_JSON, "utf8"));
    const proposalId = proposals[network.config.chainId!.toString()][proposalIndex];
    // 0 = agains, 1 = for, 2 = abstain
    const voteWay = VoteType.For.valueOf();
    console.log(`voting for proposal ${proposalId} with vote ${voteWay}`);
    const governorContract: Contract = await ethers.getContractAt("SlcDaoGovernor", GOVERNOR_ADDRESS);

    const pastTotalSupply = await governorContract.getVotes(managerTwo, blockNumber - 1);
    console.log("past total supply: ", pastTotalSupply);


    const voteTxResponse = await governorContract.connect(managerTwoSigner).castVoteWithReason(proposalId, voteWay, "Reason: manager two");
    await voteTxResponse.wait(1);

    // // we're moving blocks along because we want to get to the end of voting period (for "testing" to see the proposal state)
    if (developmentChains.includes(network.name)) {
        console.log(`moving blocks along to end of voting period; ${VOTING_DELAY + 1}`);
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