import { ethers } from "ethers";

import FAUCET_ABI from "../abis/SpectreFaucet.json";

const faucetContract = (provider: ethers.BrowserProvider) => {
	return new ethers.Contract("0x332f97F3BaeA36ccb4E968B80840a256ad9c7b2D", FAUCET_ABI, provider);
};

export default faucetContract;
