import { ethers } from "ethers";

import FAUCET_ABI from "../abis/SpectreFaucet.json";

enum NetworksChainId {
	Sepolia = "11155111",
	Polygon = "80001",
	BSC = "97",
	Avalanche = "43113",
}

const getFaucetContractAddress = (chainId: NetworksChainId) => {
	switch (chainId) {
		case NetworksChainId.Sepolia:
			return "0x332f97F3BaeA36ccb4E968B80840a256ad9c7b2D";

		case NetworksChainId.Polygon:
			return "0xbD52D0Cf44dd21cD4FeB3b67B0a8E7Da7362b32d";

		case NetworksChainId.Avalanche:
			return "0x28b1876a63D592218aF348bd0Ccbf629818606D2";

		case NetworksChainId.BSC:
			return "0x28b1876a63D592218aF348bd0Ccbf629818606D2";

		default:
			return "0x332f97F3BaeA36ccb4E968B80840a256ad9c7b2D";
	}
};

const faucetContract = (chainId: NetworksChainId, provider: ethers.BrowserProvider) => {
	const faucetContractAddress = getFaucetContractAddress(chainId);
	return new ethers.Contract(faucetContractAddress, FAUCET_ABI, provider);
};

export default faucetContract;
