import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";

describe("MAERC20 extra functions", function () {
    let accounts: Signer[];
    let owner: Signer;
    let contract: MAERC20;

    const tokenName = "My Test Token";
    const tokenSymbol = "MTT";
    const initialSupply = 1000;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        owner = accounts[0];

        const contractFactory =
            await ethers.getContractFactory("MAERC20", owner);
        contract = await contractFactory.deploy(tokenName, tokenSymbol, initialSupply);
        await contract.deployed();
    });

    it("mint should generate tokens", async function () {
        const ownerAddr = await owner.getAddress();
        const amount = 10;
        const t = contract.mint({value:amount});
        const balanceAfter = await contract.balanceOf(ownerAddr);
        const totalSupply = await contract.totalSupply();

        await expect(() => t).to.changeEtherBalances(
            [owner, contract], 
            [-amount, amount]
        );
        expect(balanceAfter).eq(amount);
        expect(totalSupply).eq(initialSupply + amount);
    });

    it("burn should destroy tokens & refund", async function () {
        const ownerAddr = await owner.getAddress();
        const mintAmount = 10;
        const burnAmount = 5;
        await contract.mint({ value: mintAmount });
        const t = contract.burn(burnAmount);
        const balanceAfter = await contract.balanceOf(ownerAddr);
        const totalSupply = await contract.totalSupply();

        await expect(() => t).to.changeEtherBalances(
            [owner, contract],
            [burnAmount, -burnAmount]
        );
        expect(balanceAfter).eq(mintAmount - burnAmount);
        expect(totalSupply).eq(initialSupply + mintAmount - burnAmount);
    });

    it("burn should revert if no enough tokens", async function () {
        const mintAmount = 10;
        const burnAmount = 15;
        await contract.mint({ value: mintAmount });
        const t = contract.burn(burnAmount);
        await expect(t).to.be.revertedWith("No enough tokens");
    });
});