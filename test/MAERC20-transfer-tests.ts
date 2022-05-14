import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import testDeployment from "./test-deployment";
import { MAERC20 } from "../typechain-types";


describe("MAERC20.transfer", function () {
    let accounts: SignerWithAddress[];
    let owner: SignerWithAddress;
    let recipient: SignerWithAddress;
    let contract: MAERC20;

    const tokenName = "My Test Token";
    const tokenSymbol = "MTT";
    const initialSupply = 1000;

    beforeEach(async function () {
        [accounts, owner, contract] =
            await testDeployment(tokenName, tokenSymbol, initialSupply);
        recipient = accounts[1];
    });

    it("should revert if the zero-address is used", async () => {
        const t = contract.transfer(ethers.constants.AddressZero, 10);
        await expect(t).to.be.revertedWith("The zero-address is not allowed");
    });

    it("should revert if no enough tokens", async () => {
        const moreThanExists = initialSupply + 10;
        const t = contract.transfer(recipient.address, moreThanExists);
        await expect(t).to.be.revertedWith("No enough tokens");
    });

    it("should emit transfer event", async () => {
        let amount = 0;
        let t = contract.transfer(recipient.address, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(owner.address, recipient.address, amount);
        
        amount = 10;
        t = contract.transfer(recipient.address, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(owner.address, recipient.address, amount);
    });

    it("should change balances", async () => {
        const amount = 10;
        await contract.transfer(recipient.address, amount);

        const ownerBalanceAfter = await contract.balanceOf(owner.address);
        const recipientBalanceAfter =
            await contract.balanceOf(recipient.address);

        expect(ownerBalanceAfter).eq(initialSupply - amount);
        expect(recipientBalanceAfter).eq(amount);
    });
});