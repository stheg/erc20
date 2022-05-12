import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";

describe("MAERC20", function () {
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

    it("should return name of the token", async function () {
        const name = await contract.name(); 
        expect(name).eq(tokenName);
    });

    it("should return symbol of the token", async function () {
        const symbol = await contract.symbol();
        expect(symbol).eq(tokenSymbol);
    });

    it("should return default decimals number", async function () {
        const decimal = await contract.decimals();
        expect(decimal).eq(2);
    });

    it("should return initial supply", async function () {
        const totalSupply = await contract.totalSupply();
        expect(totalSupply).eq(initialSupply);
    });

    it("should return default balance", async function () {
        const ownerAddr = await owner.getAddress();
        const balance = await contract.balanceOf(ownerAddr);
        expect(balance).eq(0);
    });
});