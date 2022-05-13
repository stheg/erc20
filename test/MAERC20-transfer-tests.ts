import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";
import testDeployment from "./test-deployment";

describe("MAERC20.transfer", function () {
    let accounts: Signer[];
    let owner: Signer;
    let ownerAddr: string;
    let contract: MAERC20;

    const tokenName = "My Test Token";
    const tokenSymbol = "MTT";
    const initialSupply = 1000;

    beforeEach(async function () {
        [accounts, owner, contract] =
            await testDeployment(tokenName, tokenSymbol, initialSupply);
        ownerAddr = await owner.getAddress();
    });

    it("should revert if the zero-address is used", async () => {
        let amount = 10;
        const t = contract.transfer(ethers.constants.AddressZero, amount);
        await expect(t).to.be.revertedWith("The zero-address is not allowed");
    });

    it("should revert if no enough tokens", async function () {
        const recipientAddr = await accounts[1].getAddress();
        const amount = 1001;
        const t = contract.transfer(recipientAddr, amount);
        await expect(t).to.be.revertedWith("No enough tokens");
    });

    it("should emit transfer event", async function () {
        const recipientAddr = await accounts[1].getAddress();
        let amount = 0;
        let t = contract.transfer(recipientAddr, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(ownerAddr, recipientAddr, amount);
        
        amount = 10;
        t = contract.transfer(recipientAddr, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(ownerAddr, recipientAddr, amount);
    });

    it("should change balances", async function () {
        const recipientAddr = await accounts[1].getAddress();
        const amount = 10;
        await contract.transfer(recipientAddr, amount);

        const ownerBalanceAfter = await contract.balanceOf(ownerAddr);
        const recipientBalanceAfter = await contract.balanceOf(recipientAddr);
        expect(ownerBalanceAfter).eq(initialSupply - amount);
        expect(recipientBalanceAfter).eq(amount);
    });
});