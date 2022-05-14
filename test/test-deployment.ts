import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { MAERC20 } from "../typechain-types";

export default testDeployment;

async function testDeployment(
    tokenName: string, 
    tokenSymbol: string, 
    initialSupply: number,
    doMint: boolean = true
): Promise<[SignerWithAddress[], SignerWithAddress, MAERC20]> {
    const accounts = await ethers.getSigners();
    const owner = accounts[0];

    const contractFactory =
        await ethers.getContractFactory("MAERC20", owner);
    const contract = await contractFactory.deploy(tokenName, tokenSymbol);
    await contract.deployed();

    if (doMint)
        await contract.mint(owner.address, initialSupply);

    return [accounts, owner, contract];
}