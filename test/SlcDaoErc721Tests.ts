import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, getNamedAccounts } from "hardhat";

let slcDaoErc721Contract: Contract;
const tokenUri = "ipfs://QmXKiRVcFjy4Z3oMmb7kxFZdshk7rSGA31L4JkFCxyU5JD";
const hashedDescription = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hashedDescription"));

describe("SlcDaoErc721", () => {
    beforeEach(async () => {
        const slcDaoErc721 = await ethers.getContractFactory("SlcDaoErc721");
        slcDaoErc721Contract = await slcDaoErc721.deploy([]); // no input params
    });

    it('check if contract deployed', async () => {
        expect(await slcDaoErc721Contract.symbol()).equal("SLD");
    });

    it('should mint erc721 token', async () => {
        const { managerTwo } = await getNamedAccounts();
        await slcDaoErc721Contract.safeMint(managerTwo, tokenUri);

        const tu = await slcDaoErc721Contract.tokenURI(0);
        expect(tu).equal(tokenUri);
    });
});