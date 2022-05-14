import hre from "hardhat";

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory(
        "MAERC20",
        owner
    );
    const contract = await contractFactory.deploy('MADTv2', 'MADT2');
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
