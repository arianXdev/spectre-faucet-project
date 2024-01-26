import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";

import { Header } from "./layouts";
import faucetContract from "./ethereum/faucet";

import LOGO from "./assets/images/spectre-logo-light.png";

import toast, { Toaster } from "react-hot-toast";
import Typed from "typed.js";

import "./App.scss";

const App = () => {
	const [walletAddress, setWalletAddress] = useState("");
	const [signer, setSigner] = useState<ethers.Signer>();
	const [faucet, setFaucet] = useState<ethers.Contract>();
	const [transactionData, setTransactionData] = useState("");

	const arianNameRef = useRef<HTMLHeadingElement>(null);
	const faucetNameRef = useRef(null);

	useEffect(() => {
		const arianNameTyped = new Typed(arianNameRef.current, {
			strings: [
				"Arian Hosseini",
				`<i style="font-family: $font-oxanium;font-size: 2.8rem">Blockchain Developer</i>`,
				`Arian Hosseini <i style="font-family: $font-oxanium;font-size: 2.2rem"> | Blockchain Developer</i>`,
				"Arian Hosseini",
			],
			typeSpeed: 100,
			fadeOut: true,
			startDelay: 3000,
			showCursor: false,
		});

		return () => {
			arianNameTyped.destroy();
		};
	}, []);

	useEffect(() => {
		const dexNameTyped = new Typed(faucetNameRef.current, {
			strings: [
				"<i>Spectre <span style='font-size: 19px;'>faucet</span></i>",
				"<span>The Future of Web3</span>",
				"<i>Spectre <span style='font-size: 19px;'>faucet</span></i>",
			],
			typeSpeed: 85,
			showCursor: false,
		});

		return () => {
			dexNameTyped.destroy();
		};
	}, []);

	useEffect(() => {
		// Get the current account if connected
		getCurrentWalletConnected();
		changeAccountListener();
	}, [walletAddress]);

	const connectWallet = async () => {
		if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
			try {
				// Get provider (read-only connection to the blockchain)
				const provider = new ethers.BrowserProvider(window.ethereum);

				// Fetch accounts
				const accounts = await provider.send("eth_requestAccounts", []);

				// Get signer
				setSigner(await provider.getSigner());

				// Get the local contract instance
				setFaucet(faucetContract(provider));

				setWalletAddress(accounts[0]);
			} catch (err) {
				console.log(err.message);
			}
		} else {
			toast("Please Install MetaMask extension!");
		}
	};

	const getCurrentWalletConnected = async () => {
		if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
			try {
				// Get provider (read-only connection to the blockchain)
				const provider = new ethers.BrowserProvider(window.ethereum);

				// Fetch accounts
				const accounts = await provider.send("eth_accounts", []);

				if (accounts.length > 0) {
					// Get signer
					setSigner(await provider.getSigner());

					// Get the local contract instance
					setFaucet(faucetContract(provider));
					setWalletAddress(accounts[0]);
				} else {
					toast("Please connect your wallet!");
				}
			} catch (err) {
				console.log(err.message);
			}
		} else {
			toast("Please Install MetaMask extension!");
		}
	};

	const changeAccountListener = async () => {
		if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
			window.ethereum.on("accountsChanged", (accounts) => {
				setWalletAddress(accounts[0]);
			});
		} else {
			setWalletAddress("");
		}
	};

	const getSPECHandler = async (e) => {
		e.preventDefault();

		try {
			const faucetContractWithSigner = faucet.connect(signer);
			const tx = await faucetContractWithSigner.requestTokens();
			toast.success("Operation succeeded - Enjoy interacting with Spectre DEX!");
			setTransactionData(tx.hash);
		} catch (err) {
			console.log(err.message);
			toast.error("Something went wrong! - Try again later.");
		}
	};

	return (
		<>
			<Header connectWallet={connectWallet} account={walletAddress} />

			<main className="main">
				<div className="container">
					<div className="main__wrapper">
						<div className="main__logo">
							<img src={LOGO} alt="spectre-dex-logo" />
						</div>

						<div className="main__content-container">
							<h2 className="main__dex-name" ref={faucetNameRef}>
								Spectre FAUCET
							</h2>
							<h2 className="main__text">Get & Use tokens within SPECTRE DEX</h2>
							<div className="main__subtext-container">
								<h2 className="main__subtext">Fast and reliable. 100 SPEC / day.</h2>
							</div>

							<div className="main__box">
								<form>
									<input
										type="text"
										placeholder="Enter Your Wallet Address (0x...)"
										defaultValue={walletAddress ? walletAddress : ""}
									/>

									<button
										type="submit"
										className="main__btn"
										onClick={getSPECHandler}
										disabled={walletAddress ? false : true}
									>
										Get SPEC
									</button>
								</form>

								{transactionData ? (
									<p className="tx-hash">
										TX Hash:{" "}
										<a href={`https://sepolia.etherscan.io/tx/${transactionData}`} target="_blank">
											{transactionData}
										</a>
									</p>
								) : null}
							</div>
						</div>
					</div>
				</div>

				<div className="main__bg"></div>
				<div className="main__gradient"></div>
				<div className="main__glow-container">
					<div className="main__glow"></div>
				</div>
			</main>

			<Toaster
				toastOptions={{
					className: "Toaster",
				}}
			/>

			<h2 className="arian-name" ref={arianNameRef}></h2>
		</>
	);
};

export default App;
