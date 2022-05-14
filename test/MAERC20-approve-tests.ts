import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";
import testDeployment from "./test-deployment";

describe("MAERC20.approve", function () {
    let accounts: SignerWithAddress[];
    let owner: SignerWithAddress;
    let contract: MAERC20;

    const tokenName = "My Test Token";
    const tokenSymbol = "MTT";
    const initialSupply = 1000;

    beforeEach(async function () {
        [accounts, owner, contract] =
            await testDeployment(tokenName, tokenSymbol, initialSupply);
    });

    it("should revert if the zero-address is used", async () => {
        const t = contract.approve(ethers.constants.AddressZero, 10);
        await expect(t).to.be.revertedWith("The zero-address is not allowed");
    });

    it("should emit Approval event", async () => {
        const spender = accounts[1];
        let amount = 10;
        const t = contract.approve(spender.address, amount);
        await expect(t).to.emit(contract, "Approval")
            .withArgs(owner.address, spender.address, amount);
    });

    it("should set allowance instead of the previous value", async () => {
        const spender = accounts[1];
        let approvedAmount = 10;
        await contract.approve(spender.address, approvedAmount);
        const firstAllowedAmount = 
            await contract.allowance(owner.address, spender.address);
        expect(firstAllowedAmount).eq(approvedAmount);

        approvedAmount = 13;
        await contract.approve(spender.address, approvedAmount);
        const secondAllowedAmount = 
            await contract.allowance(owner.address, spender.address);
        expect(secondAllowedAmount)
            .not.eq(firstAllowedAmount.add(approvedAmount));
    });
});