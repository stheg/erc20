import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { ERC20 } from "../typechain-types";
import { any } from "hardhat/internal/core/params/argumentTypes";

describe("erc20", function () {
    let accounts: Signer[];
    let owner: Signer;
    let contract: ERC20;

    beforeEach(async function () {
        accounts = await ethers.getSigners();

        const contractFactory =
            await ethers.getContractFactory("ERC20", owner);
        contract = await contractFactory.deploy();
        await contract.deployed();
    });

    it("should get name", async function () {
        const name = await contract.name(); 
        expect(name).eq("test");
    });
});