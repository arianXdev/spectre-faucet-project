import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
// const AVALANCHESCAN_API_KEY = process.env.AVALANCHESCAN_API_KEY || "";
// const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || "";
// const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

const config: HardhatUserConfig = {
	solidity: "0.8.23",
	networks: {
		sepolia: {
			url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
			accounts: [process.env.PRIVATE_KEY || ""],
		},
		// Polygon testnet
		polygon: {
			url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
			accounts: [process.env.PRIVATE_KEY || ""],
		},
		// BNB Chain (formerly Binance Smart Chain) testnet
		bnb: {
			url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
			chainId: 97,
			gasPrice: 20000000000,
			accounts: [process.env.PRIVATE_KEY || ""],
		},
		// Avalanche C-chain testnet (Fuji)
		avalanche: {
			url: `https://avalanche-fuji.infura.io/v3/${INFURA_API_KEY}`,
			accounts: [process.env.PRIVATE_KEY || ""],
		},
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
		// apiKey: AVALANCHESCAN_API_KEY,
		// apiKey: BSCSCAN_API_KEY,
		// apiKey: POLYGONSCAN_API_KEY,
	},
};

export default config;
