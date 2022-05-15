import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";
import testDeployment from "./test-deployment";

describe("MAERC20 extra functions", function () {
    let accounts: SignerWithAddress[];
    let owner: SignerWithAddress;
    let contract: MAERC20;

    const tokenName = "My Test Token";
    const tokenSymbol = "MTT";

    beforeEach(async function () {
        [accounts, owner, contract] =
            await testDeployment(tokenName, tokenSymbol, 0, false);
    });

    it("mint should revert if called not by the owner", async function () {
        const notOwner = accounts[1];
        const t = contract.connect(accounts[1]).mint(notOwner.address, 10);
        
        await expect(t).to.be.revertedWith("Only the owner can do this.");
    });

    it("mint should revert if zero address is used", async function () {
        const t = contract.mint(ethers.constants.AddressZero, 10);
        await expect(t).to.be.revertedWith("The zero-address is not allowed.");
    });

    it("mint should increase balance and total supply", async function () {
        const amount = 10;
        const balanceBefore = await contract.balanceOf(owner.address);
        const totalSupplyBefore = await contract.totalSupply();

        await contract.mint(owner.address, amount);
        const balanceAfter = await contract.balanceOf(owner.address);
        const totalSupplyAfter = await contract.totalSupply();

        expect(balanceAfter).eq(balanceBefore.add(amount));
        expect(totalSupplyAfter).eq(totalSupplyBefore.add(amount));
    });

    it("mint should emit Transfer event", async function () {
        const amount = 10;
        const t = contract.mint(owner.address, amount);

        await expect(t).to.emit(contract, "Transfer")
            .withArgs(ethers.constants.AddressZero, owner.address, amount);
    });

    it("burn should decrease balance and total supply", async function () {
        const burnAmount = 5;
        await contract.mint(owner.address, 2*burnAmount);
        const balanceBefore = await contract.balanceOf(owner.address);
        const totalSupplyBefore = await contract.totalSupply();

        await contract.burn(burnAmount);
        const balanceAfter = await contract.balanceOf(owner.address);
        const totalSupplyAfter = await contract.totalSupply();

        expect(balanceAfter).eq(balanceBefore.sub(burnAmount));
        expect(totalSupplyAfter).eq(totalSupplyBefore.sub(burnAmount));
    });

    it("burn should emit Transfer event", async function () {
        const burnAmount = 5;
        await contract.mint(owner.address, 2*burnAmount);
        const t = contract.burn(burnAmount);

        await expect(t).to.emit(contract, "Transfer")
            .withArgs(owner.address, ethers.constants.AddressZero, burnAmount);
    });

    it("burn should revert if no enough tokens", async function () {
        const mintAmount = 10;
        const burnAmount = 15;
        await contract.mint(owner.address, mintAmount);
        const t = contract.burn(burnAmount);

        await expect(t).to.be.revertedWith("No enough tokens");
    });

    it("burn should revert if called not by the owner", async function () {
        const notOwner = accounts[1];
        const burnAmount = 15;
        await contract.mint(notOwner.address, 2*burnAmount);
        const t = contract.connect(notOwner).burn(burnAmount);

        await expect(t).to.be.revertedWith("Only the owner can do this.");
    });
});