import { task } from "hardhat/config";
import { MAERC20 } from "../typechain-types";

task("transfer", "Transfers the amount of tokens to the specified address")
.addParam("contract", "Address of the contract")
.addParam("value", "Amount of tokens to be transferred")
.addOptionalParam("from", "Senders's address")
.addOptionalParam("to", "Recipient's address")
.setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    let from = args.from ?? accounts[0].address;
    let to = args.to ?? accounts[1].address;
    const contract: MAERC20 = await hre.run(
        "init-contract", 
        {address: args.contract, signer:from}
    );
    await contract.transfer(to, args.value);
});

task("transfer-from", "The spender transfers from the approved from-address to the to-address")
    .addParam("contract", "Address of the contract")
    .addParam("value", "The amount which is allowed to transfer")
    .addOptionalParam("from", "Address of from")
    .addOptionalParam("to", "Address of recipient")
    .addOptionalParam("spender", "Address of spender")
    .setAction(async (args, hre) => {
        const accounts = await hre.ethers.getSigners();
        let from = args.from ?? accounts[0].address;
        let to = args.to ?? accounts[1].address;
        let spender = args.spender ?? accounts[1].address;
        const contract: MAERC20 = await hre.run(
            "init-contract",
            { address: args.contract, signer: spender }
        );
        await contract.transferFrom(from, to, args.value);
    })

task("approve", "Sets the amount which the spender can transfer from someone balance")
    .addParam("contract", "Address of the contract")
    .addParam("value", "The amount which is allowed to transfer")
    .addOptionalParam("from", "Address of owner")
    .addOptionalParam("spender", "Address of spender")
    .setAction(async (args, hre) => {
        const accounts = await hre.ethers.getSigners();
        let owner = args.from ?? accounts[0].address;
        let spender = args.spender ?? accounts[1].address;
        const contract: MAERC20 = await hre.run(
            "init-contract",
            { address: args.contract, signer: owner }
        );
        await contract.approve(spender, args.value);
    });

task("mint", "Changes ether to tokens")
    .addParam("contract", "Address of the contract")
    .addParam("value", "Amount of ether to change on tokens")
    .addOptionalParam("from", "Senders's address")
    .addOptionalParam("to", "Address of recipient")
    .setAction(async (args, hre) => {
        const accounts = await hre.ethers.getSigners();
        let from = args.from ?? accounts[0].address;
        let to = args.to ?? from;
        const contract: MAERC20 = await hre.run(
            "init-contract",
            { address: args.contract, signer: from }
        );
        await contract.mint(to, args.value);
    });

task("burn", "Burns tokens and refunds ether")
    .addParam("contract", "Address of the contract")
    .addParam("value", "Amount of tokens to burn")
    .addOptionalParam("from", "Senders's address")
    .setAction(async (args, hre) => {
        const accounts = await hre.ethers.getSigners();
        let from = args.from ?? accounts[0].address;
        const contract: MAERC20 = await hre.run(
            "init-contract",
            { address: args.contract, signer: from }
        );
        await contract.burn(args.value);
    });