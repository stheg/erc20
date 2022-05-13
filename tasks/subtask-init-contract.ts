import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { subtask } from "hardhat/config";
import { MAERC20 } from "../typechain-types";

subtask("init-contract", "Initializes the contract")
    .addParam("address", "Contract's address")
    .addParam("signer", "Signer who will do transactions", typeof(SignerWithAddress))
    .setAction(async function (args, hre): Promise<MAERC20> {
        const signer = await hre.ethers.getSigner(args.signer);
        const contractFactory = await hre.ethers.getContractFactory("MAERC20");
        const contract =
            await new hre.ethers.Contract(args.address, contractFactory.interface, signer);
        //const tmp = await hre.ethers.getSigner(contract.address);
        //const balance = await tmp.getBalance();
        // console.log("Contract's balance = " + balance + " wei")
        return contract as MAERC20;
    })