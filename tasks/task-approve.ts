import { task } from "hardhat/config";
import { MAERC20 } from "../typechain-types";

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