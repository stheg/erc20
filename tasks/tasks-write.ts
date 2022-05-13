import { task } from "hardhat/config";
import { MAERC20 } from "../typechain-types";

task("transfer", "Transfers the amount of tokens to the specified address")
.addParam("contract", "Address of the contract")
.addParam("value", "Amount of tokens to be transferred")
.addOptionalParam("from", "Senders's address")
.addOptionalParam("to", "Recipient's address")
.setAction(async (args, hre) => {
    let from: string;
    let toAddr: string;

    const accounts = await hre.ethers.getSigners();
    if (!args.from) {
        console.log("default account #1 is used as sender");
        from = await accounts[0].getAddress();
    } else {
        from = args.from;
    }
    if (!args.to) {
        console.log("default account #2 is used as recipient");
        toAddr = await accounts[1].getAddress();
    } else {
        toAddr = args.to;
    }
    const contract: MAERC20 = await hre.run(
        "init-contract", 
        {address: args.contract, signer:from}
    );
    await contract.transfer(toAddr, args.value, {});
});

task("transfer-from", "The specified spender transfers from the specified from-address to the specified to-address")
    .addParam("contract", "Address of the contract")
    .addParam("value", "The amount which is allowed to transfer")
    .addOptionalParam("from", "Address of from")
    .addOptionalParam("to", "Address of recipient")
    .addOptionalParam("spender", "Address of spender")
    .setAction(async (args, hre) => {
        let from: string;
        let to: string;
        let spender: string;

        const accounts = await hre.ethers.getSigners();
        if (!args.from) {
            console.log("default account #1 is used");
            from = await accounts[0].getAddress();
        } else {
            from = args.from;
        }
        if (!args.to) {
            console.log("default account #2 is used");
            to = await accounts[1].getAddress();
        } else {
            to = args.to;
        }
        if (!args.spender) {
            console.log("default account #2 is used");
            spender = await accounts[1].getAddress();
        } else {
            spender = args.spender;
        }
        const contract: MAERC20 = await hre.run(
            "init-contract",
            { address: args.contract, signer: spender }
        );
        await contract.transferFrom(from, to, args.value);
    })

task("approve", "Sets the amount which can be transferred from the specified address by the specified spender")
    .addParam("contract", "Address of the contract")
    .addParam("value", "The amount which is allowed to transfer")
    .addOptionalParam("from", "Address of owner")
    .addOptionalParam("spender", "Address of spender")
    .setAction(async (args, hre) => {
        let owner: string;
        let spender: string;

        const accounts = await hre.ethers.getSigners();
        if (!args.from) {
            console.log("default account #1 is used");
            owner = await accounts[0].getAddress();
        } else {
            owner = args.from;
        }
        if (!args.spender) {
            console.log("default account #2 is used");
            spender = await accounts[1].getAddress();
        } else {
            spender = args.spender;
        }
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
    .setAction(async (args, hre) => {
        let from: string;

        const accounts = await hre.ethers.getSigners();
        if (!args.from) {
            console.log("default account #1 is used as sender");
            from = await accounts[0].getAddress();
        } else {
            from = args.from;
        }
        const contract: MAERC20 = await hre.run(
            "init-contract",
            { address: args.contract, signer: from }
        );
        await contract.mint({value:args.value});
    });

task("burn", "Burns tokens and refunds ether")
    .addParam("contract", "Address of the contract")
    .addParam("value", "Amount of tokens to burn")
    .addOptionalParam("from", "Senders's address")
    .setAction(async (args, hre) => {
        let from: string;

        const accounts = await hre.ethers.getSigners();
        if (!args.from) {
            console.log("default account #1 is used as sender");
            from = await accounts[0].getAddress();
        } else {
            from = args.from;
        }
        const contract: MAERC20 = await hre.run(
            "init-contract",
            { address: args.contract, signer: from }
        );
        await contract.burn(args.value);
    });