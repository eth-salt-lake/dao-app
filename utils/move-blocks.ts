import { network } from "hardhat";

// simulates mining blocks
export async function moveBlocks(amount: number) {
    console.log("Moving blocks forward...");
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: []
        })
    }
}