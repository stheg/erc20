import { task } from "hardhat/config";
import { MAERC20 } from "../typechain-types";

task("balance", "Transfers the amount of tokens to the specified address")
    .addParam("contract", "Address of the contract")
    .addOptionalParam("addr", "Address of an account")
    .setAction(async (args, hre): Promise<number> => {
        let addr: string;

        const accounts = await hre.ethers.getSigners();
        if (!args.to) {
            console.log("default account #2 is used");
            addr = await accounts[0].getAddress();
        } else {
            addr = args.to;
        }
        const contract: MAERC20 = await hre.run("init-contract", { address: args.contract, signer: addr })
        const balance = await contract.balanceOf(addr);
        console.log(balance.toNumber());
        
        return balance.toNumber();
    });

task("allowance", "Returns amount which the spender can spend from someone balance")
    .addParam("contract", "Address of the contract")
    .addOptionalParam("from", "Address of owner")
    .addOptionalParam("spender", "Address of spender")
    .setAction(async (args, hre): Promise<number> => {
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
            { address: args.contract, signer: spender }
        );
        const approvedAmount = await contract.allowance(owner, spender);
        console.log(approvedAmount.toNumber());

        return approvedAmount.toNumber();
    });