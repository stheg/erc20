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
    const contract: MAERC20 = await hre.run("init-contract", {address: args.contract, signer:from})
    // const contract = await initContract(args.contract, from);
    await contract.transfer(toAddr, args.value);
});