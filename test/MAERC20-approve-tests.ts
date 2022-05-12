import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";

describe("MAERC20.approve", function () {
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

    it("should revert if the zero-address is used", async () => {
        let amount = 10;
        const t = contract.approve(ethers.constants.AddressZero, amount);
        await expect(t).to.be.revertedWith("The zero-address is not allowed");
    });

    it("should emit Approval event", async () => {
        const ownerAddr = await owner.getAddress();
        const spenderAddr = await accounts[1].getAddress();
        let amount = 10;
        const t = contract.approve(spenderAddr, amount);
        await expect(t).to.emit(contract, "Approval")
            .withArgs(ownerAddr, spenderAddr, amount);
    });

    it("should set allowance instead of the previous value", async () => {
        const ownerAddr = await owner.getAddress();
        const spenderAddr = await accounts[1].getAddress();
        let amount = 10;
        await contract.approve(spenderAddr, amount);
        const firstApproval = await contract.allowance(ownerAddr, spenderAddr);
        expect(firstApproval).eq(amount);

        amount = 13;
        await contract.approve(spenderAddr, amount);
        const secondApproval = await contract.allowance(ownerAddr, spenderAddr);
        console.log(Number(firstApproval) + amount);
        expect(secondApproval).not.eq(Number(firstApproval) + amount);
    });
});