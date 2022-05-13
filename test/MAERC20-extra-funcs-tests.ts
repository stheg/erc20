import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";
import testDeployment from "./test-deployment";

describe("MAERC20 extra functions", function () {
    let accounts: Signer[];
    let owner: Signer;
    let contract: MAERC20;

    const tokenName = "My Test Token";
    const tokenSymbol = "MTT";

    beforeEach(async function () {
        [accounts, owner, contract] =
            await testDeployment(tokenName, tokenSymbol, 0, false);
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
        expect(totalSupply).eq(amount);
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
        expect(totalSupply).eq(mintAmount - burnAmount);
    });

    it("burn should revert if no enough tokens", async function () {
        const mintAmount = 10;
        const burnAmount = 15;
        await contract.mint({ value: mintAmount });
        const t = contract.burn(burnAmount);
        await expect(t).to.be.revertedWith("No enough tokens");
    });
});