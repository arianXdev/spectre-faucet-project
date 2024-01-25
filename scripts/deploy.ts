import { ethers } from "hardhat";

async function main() {
	console.log("Preparing deployment...\n");

	const spectreFaucet = await ethers.deployContract("SpectreFaucet", ["0x4aFd39239Dca334F02e9F829700733B4DE048595"]);
	await spectreFaucet.waitForDeployment();

	console.log(`Spectre Faucet contract deployed to: ${await spectreFaucet.getAddress()}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
