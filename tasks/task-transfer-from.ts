import { task } from "hardhat/config";
import { MAERC20 } from "../typechain-types";

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