import { BigNumber, Contract } from "ethers";
import { ethers, getNamedAccounts } from "hardhat";

// mints the new erc721 to the deployer
export async function mintErc721() {
    const { managerTwo, manager } = await getNamedAccounts();
    const erc721Contract: Contract = await ethers.getContract("SlcDaoErc721");

    const tokenUri = "ipfs://QmXKiRVcFjy4Z3oMmb7kxFZdshk7rSGA31L4JkFCxyU5JD";
    await erc721Contract.safeMint(managerTwo, tokenUri);

    const balanceTwo: BigNumber = await erc721Contract.balanceOf(managerTwo);
    console.log(`token balance of ${managerTwo} is ${balanceTwo.toString()}`)


    await erc721Contract.safeMint(manager, tokenUri);

    const balance: BigNumber = await erc721Contract.balanceOf(manager);
    console.log(`token balance of ${manager} is ${balance.toString()}`)
}

mintErc721().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});