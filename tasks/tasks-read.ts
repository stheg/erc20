import { task } from "hardhat/config";
import { MAERC20 } from "../typechain-types";

task("balance", "Transfers the amount of tokens to the specified address")
    .addParam("contract", "Address of the contract")
    .addOptionalParam("addr", "Address of an account")
    .setAction(async (args, hre): Promise<number> => {
        const accounts = await hre.ethers.getSigners();
        let addr = args.addr ?? accounts[0].address;
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
        const accounts = await hre.ethers.getSigners();
        let owner = args.from ?? accounts[0].address;
        let spender = args.spender ?? accounts[1].address;
        const contract: MAERC20 = await hre.run(
            "init-contract",
            { address: args.contract, signer: spender }
        );
        const approvedAmount = await contract.allowance(owner, spender);
        console.log(approvedAmount.toNumber());

        return approvedAmount.toNumber();
    });