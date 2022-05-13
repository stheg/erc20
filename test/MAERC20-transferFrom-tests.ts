import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";
import testDeployment from "./test-deployment";

describe("MAERC20.transferFrom", function () {
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

    it("should revert if sender isn't approved", async () => {
        const notAllowedAddr = await accounts[1].getAddress();
        const amount = 10;
        const t = contract.transferFrom(notAllowedAddr, ownerAddr, amount);
        await expect(t).to.be.revertedWith("No enough approved amount");
    });

    it("should work as transfer if a sender == 'from'", async () => {
        const anotherAddr = await accounts[1].getAddress();
        const amount = 10;
        const t = contract.transferFrom(ownerAddr, anotherAddr, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(ownerAddr, anotherAddr, amount);
    });

    it("should revert if no enough tokens", async () => {
        const spender = accounts[1];
        const spenderAddr = await spender.getAddress(); 
        const amount = 1001;
        await contract.approve(spenderAddr, 2 * amount);
        const t = contract.connect(spender)
            .transferFrom(ownerAddr, spenderAddr, amount);
        await expect(t).to.be.revertedWith("No enough tokens");
    });

    it("should revert if value exceeds the approved one", async () => {
        const spender = accounts[1];
        const spenderAddr = await spender.getAddress(); 
        const amount = 100;
        await contract.approve(spenderAddr, amount / 10);
        const t = contract.connect(spender)
            .transferFrom(ownerAddr, spenderAddr, amount);
        await expect(t).to.be.revertedWith("No enough approved amount");
    });

    it("should emit transfer event", async () => {
        const spender = accounts[1];
        const spenderAddr = await spender.getAddress(); 
        let amount = 10;
        await contract.approve(spenderAddr, amount);
        let t = contract.connect(spender)
            .transferFrom(ownerAddr, spenderAddr, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(ownerAddr, spenderAddr, amount);

        amount = 0;
        t = contract.connect(spender)
            .transferFrom(ownerAddr, spenderAddr, amount);
        await expect(t).to.emit(contract, "Transfer")
            .withArgs(ownerAddr, spenderAddr, amount);
    });

    it("should change balances & allowance", async () => {
        const spender = accounts[1];
        const spenderAddr = await spender.getAddress();
        const amount = 10;
        const allowed = amount * 2;
        await contract.approve(spenderAddr, allowed);
        await contract.connect(spender)
            .transferFrom(ownerAddr, spenderAddr, amount);

        const ownerBalanceAfter = await contract.balanceOf(ownerAddr);
        const spenderBalanceAfter = await contract.balanceOf(spenderAddr);
        const stillAllowed = await contract.allowance(ownerAddr, spenderAddr);
        expect(ownerBalanceAfter).eq(initialSupply - amount);
        expect(spenderBalanceAfter).eq(amount);
        expect(stillAllowed).eq(allowed - amount);
    });
});