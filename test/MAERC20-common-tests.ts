import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { MAERC20 } from "../typechain-types";
import testDeployment from "./test-deployment";

describe("MAERC20", function () {
    let accounts: SignerWithAddress[];
    let owner: SignerWithAddress;
    let contract: MAERC20;

    const tokenName = "My Test Token";
    const tokenSymbol = "MTT";
    const initialSupply = 1000; 

    beforeEach(async function () {
        [accounts, owner, contract] = 
            await testDeployment(tokenName, tokenSymbol, initialSupply, false);
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
        expect(totalSupply).eq(0);
    });

    it("should return default balance", async function () {
        const balance = await contract.balanceOf(owner.address);
        expect(balance).eq(0);
    });
});