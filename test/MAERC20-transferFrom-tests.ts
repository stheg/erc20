import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";
import testDeployment from "./test-deployment";

describe("MAERC20.transferFrom", function () {
    let accounts: SignerWithAddress[];
    let owner: SignerWithAddress;
    let spender: SignerWithAddress;
    let recipient: SignerWithAddress;
    let contract: MAERC20;

    const tokenName = "My Test Token";
    const tokenSymbol = "MTT";
    const initialSupply = 1000;

    beforeEach(async function () {
        [accounts, owner, contract] =
            await testDeployment(tokenName, tokenSymbol, initialSupply);
        spender = accounts[1];
        recipient = accounts[2];
    });

    it("should revert if sender isn't approved", async () => {
        const notApprovedSpender = spender;
        const t = contract.transferFrom(
            notApprovedSpender.address, 
            owner.address, 
            10
        );
        await expect(t).to.be.revertedWith("No enough approved amount");
    });

    it("should work as transfer if a sender == 'from'", async () => {
        const amount = 10;
        const t = 
            contract.transferFrom(owner.address, recipient.address, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(owner.address, recipient.address, amount);
    });

    it("should revert if no enough tokens", async () => {
        const moreThanOnBalance = initialSupply + 10;
        await contract.approve(spender.address, 2*moreThanOnBalance);
        const t = contract.connect(spender)
            .transferFrom(owner.address, spender.address, moreThanOnBalance);
        await expect(t).to.be.revertedWith("No enough tokens");
    });

    it("should revert if value exceeds the approved one", async () => {
        const approvedAmount = 10;
        const moreThanApproved = approvedAmount * 10;
        await contract.approve(spender.address, approvedAmount);
        const t = contract.connect(spender)
            .transferFrom(owner.address, spender.address, moreThanApproved);
        await expect(t).to.be.revertedWith("No enough approved amount");
    });

    it("should emit transfer event", async () => {
        let amount = 10;
        await contract.approve(spender.address, amount);
        let t = contract.connect(spender)
            .transferFrom(owner.address, spender.address, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(owner.address, spender.address, amount);

        amount = 0;
        t = contract.connect(spender)
            .transferFrom(owner.address, spender.address, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(owner.address, spender.address, amount);
    });

    it("should change balances & allowance", async () => {
        const amount = 10;
        const approvedAmount = amount * 2;
        await contract.approve(spender.address, approvedAmount);
        await contract.connect(spender)
            .transferFrom(owner.address, spender.address, amount);

        const ownerBalanceAfter = await contract.balanceOf(owner.address);
        const spenderBalanceAfter = await contract.balanceOf(spender.address);
        const stillAllowed = 
            await contract.allowance(owner.address, spender.address);
        
        expect(ownerBalanceAfter).eq(initialSupply - amount);
        expect(spenderBalanceAfter).eq(amount);
        expect(stillAllowed).eq(approvedAmount - amount);
    });
});