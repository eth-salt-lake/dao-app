import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, getNamedAccounts } from "hardhat";

let slcDaoTopicsContract: Contract;
const hashedDescription = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hashedDescription"));

describe("SlcDaoTopics", () => {
  beforeEach(async () => {

    const SlcDaoContract = await ethers.getContractFactory("SlcDaoTopics");
    slcDaoTopicsContract = await SlcDaoContract.deploy([]);
    await slcDaoTopicsContract.deployed();

  });

  it('check if SlcDaoContract contract deployed', async () => {
    console.log(slcDaoTopicsContract.address);
  });

  it('add managers', async () => {
    const { deployer, manager, managerTwo } = await getNamedAccounts();
    const deploySigner = await ethers.getSigner(deployer);
    await slcDaoTopicsContract.connect(deploySigner).addManager(manager);
    await slcDaoTopicsContract.connect(deploySigner).addManager(managerTwo);
  });

  it('remove manager', async () => {
    const { manager, managerTwo } = await getNamedAccounts();
    await slcDaoTopicsContract.addManager(manager);
    await slcDaoTopicsContract.addManager(managerTwo);
    await slcDaoTopicsContract.removeManager(manager);
  });

  it('add proposal - as unauthorized user', async () => {
    const { manager } = await getNamedAccounts();
    const managerSigner = await ethers.getSigner(manager);
    // calling addManager as manager (transaction is expected to revert)
    await expect(slcDaoTopicsContract.connect(managerSigner).addManager(manager)).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
  });

  it('add passed proposal', async () => {
    await slcDaoTopicsContract.addPassedProposal(hashedDescription);
    const observed = await slcDaoTopicsContract.getPassedProposal(hashedDescription);
    expect(observed).equal(false);
  });

  it('add and observe proposal', async () => {
    const { manager, managerTwo } = await getNamedAccounts();
    await slcDaoTopicsContract.addPassedProposal(hashedDescription);

    // add manager 
    await slcDaoTopicsContract.addManager(manager);

    // makr as observed as manager
    const signer = await ethers.getSigner(manager);
    await slcDaoTopicsContract.connect(signer).markProposalAsObserved(hashedDescription);
    const observed = await slcDaoTopicsContract.getPassedProposal(hashedDescription);
    expect(observed).equal(true);
  });

  it('add and observe proposal as owner (only managers allowed)', async () => {
    await slcDaoTopicsContract.addPassedProposal(hashedDescription);
    await expect(slcDaoTopicsContract.markProposalAsObserved(hashedDescription)).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'not allowed'");
  });

  it('Basic encodedFunction output test', async () => {

    const functionToCall = "addPassedProposal";
    const proposalDescription = "this is my proposal description";
    const args = ethers.utils.id(proposalDescription);
    const encodedFunctionCall = slcDaoTopicsContract.interface.encodeFunctionData(functionToCall, [args]);

    console.log("encodedFunctionCall", encodedFunctionCall);


    console.log(`Proposing ${functionToCall} on ${slcDaoTopicsContract.address} with ${args}`);
    console.log(`Proposal description: \n ${proposalDescription}`);

  });
});