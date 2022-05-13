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