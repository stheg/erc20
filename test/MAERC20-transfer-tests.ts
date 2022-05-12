import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";

describe("MAERC20.transfer", function () {
    let accounts: Signer[];
    let owner: Signer;
    let ownerAddr: string;
    let contract: MAERC20;

    const tokenName = "My Test Token";
    const tokenSymbol = "MTT";
    const initialSupply = 1000;

    const startBalance = 1000;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        owner = accounts[0];

        const contractFactory =
            await ethers.getContractFactory("MAERC20", owner);
        contract = await contractFactory.deploy(tokenName, tokenSymbol, initialSupply);
        await contract.deployed();

        ownerAddr = await owner.getAddress();
        await contract.mint({ value: startBalance });
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
        expect(ownerBalanceAfter).eq(startBalance - amount);
        expect(recipientBalanceAfter).eq(amount);
    });
});