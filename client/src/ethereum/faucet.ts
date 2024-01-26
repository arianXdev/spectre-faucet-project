import { ethers } from "ethers";

import FAUCET_ABI from "../abis/SpectreFaucet.json";

const faucetContract = (provider: ethers.BrowserProvider) => {
	const faucetContractAddress = import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS;
	return new ethers.Contract(faucetContractAddress, FAUCET_ABI, provider);
};

export default faucetContract;
