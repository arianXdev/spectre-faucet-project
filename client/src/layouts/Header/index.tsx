import { ReactElement, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../../assets/images/spectre-logo-light.png";
import BNBChainLogo from "../../assets/images/bnb-chain.png";
import PolygonLogo from "../../assets/images/polygon-logo.svg";
import AvalancheLogo from "../../assets/images/avalanche-logo.svg";

import { Icon } from "../../components";
import "./Header.scss";
import toast, { CheckmarkIcon, ErrorIcon } from "react-hot-toast";

enum Networks {
	Sepolia = "Sepolia",
	Polygon = "Polygon",
	BSC = "BSC",
	Avalanche = "Avalanche",
}

enum NetworksName {
	Sepolia = "Ethereum testnet (Sepolia)",
	Polygon = "Polygon testnet (Mumbai)",
	BSC = "BNB Smart Chain testnet",
	Avalanche = "Avalanche testnet (Fuji)",
}

enum NetworksChainId {
	Sepolia = "0xaa36a7",
	Polygon = "0x13881",
	BSC = "0x61",
	Avalanche = "0xa869",
}

enum RPCURLs {
	Sepolia = "https://sepolia.infura.io/v3/",
	Polygon = "https://rpc-mumbai.maticvigil.com",
	BSC = "https://bsc-testnet.bnbchain.org",
	Avalanche = "https://api.avax-test.network/ext/bc/C/rpc",
}

enum NetworksSymbol {
	Sepolia = "ETH",
	Polygon = "MATIC",
	BSC = "BNB",
	Avalanche = "AVAX",
}

const Header = ({ connectWallet, account, rawChainId }) => {
	// Get the current network's chain ID
	const chainId = `0x${rawChainId?.toString(16).toLowerCase()}`;

	const [showNetworkMenu, setShowNetworkMenu] = useState<boolean>(false);
	const [selectedNetwork, setSelectedNetwork] = useState<Networks>(Networks.Sepolia);

	const accountAddress = `${account?.substring(0, 7) || "0x000"}...${account?.substring(37, 42) || "0000"}`;

	const networkMenuRef = useRef<HTMLDivElement>(null);

	// get the network icon based on the selected network
	const getSelectedNetworkIcon = (): ReactElement => {
		if (selectedNetwork === Networks.Sepolia) return <i className="Header__network-icon fa-brands fa-ethereum"></i>;
		else if (selectedNetwork === Networks.Polygon) return <img src={PolygonLogo} alt="Polygon" />;
		else if (selectedNetwork === Networks.BSC) return <img src={BNBChainLogo} alt="BNB-chain" />;
		else if (selectedNetwork === Networks.Avalanche) return <img src={AvalancheLogo} alt="Avalanche" />;
		else return <i className="Header__network-icon fa-brands fa-ethereum"></i>;
	};

	const onNetworkChanged = async (network: Networks) => {
		setShowNetworkMenu(false);

		if (network !== selectedNetwork) {
			// Get the chainId of the selected network by user
			const chainId = NetworksChainId[network];

			let toastApprove;
			// Send a request to MetaMask to change the network
			try {
				toastApprove = toast.loading("Please approve to switch the network...", {
					icon: <span className={`toast-spinner ${network ? "visible" : ""}`}></span>,
				});

				await window.ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId }],
				});

				toast.success("The page will reload in a sec...", { id: toastApprove, duration: 6000, icon: <CheckmarkIcon /> });
				setSelectedNetwork(network);
			} catch (switchError: any) {
				// This error code indicates that the chain has not been added to MetaMask.
				if (switchError.code === 4902) {
					try {
						await window.ethereum.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId,
									chainName: NetworksName[network],
									rpcUrls: [RPCURLs[network]],
									nativeCurrency: {
										name: Networks[network],
										symbol: NetworksSymbol[network],
										decimals: 18,
									},
								},
							],
						});
					} catch (err: unknown) {
						toast.error("Couldn't switch the network! - Please try again.", {
							id: toastApprove,
							duration: 4000,
							icon: <ErrorIcon />,
						});

						console.log(err);
					}
				}
			}
		}
	};

	const handleOutsideClick = (event: MouseEvent) => {
		if (networkMenuRef.current && !networkMenuRef.current.contains(event.target as Node)) {
			setShowNetworkMenu(false);
		}
	};

	useEffect(() => {
		// Check to see which network the user has selected
		if (chainId === NetworksChainId.Sepolia) setSelectedNetwork(Networks.Sepolia);
		else if (chainId === NetworksChainId.Polygon) setSelectedNetwork(Networks.Polygon);
		else if (chainId === NetworksChainId.BSC) setSelectedNetwork(Networks.BSC);
		else if (chainId === NetworksChainId.Avalanche) setSelectedNetwork(Networks.Avalanche);
	}, [account, chainId]);

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	return (
		<header className="Header">
			<div className="Header__logo">
				<Link to="/" className="Header__link">
					<img src={Logo} alt="Spectre-DEX-logo" className="Header__img" />
					<h1 className="Header__title">Spectre</h1>
					<span className="Header__span">faucet</span>
				</Link>
			</div>

			<div className={`Header__connection ${account ? "connected" : ""}`}>
				<div className="Header__networks">
					<div className="Header__network" ref={networkMenuRef}>
						<button
							name={selectedNetwork}
							onClick={() => setShowNetworkMenu(!showNetworkMenu)}
							className={`Header__network-btn ${showNetworkMenu ? "active" : ""}`}
						>
							{getSelectedNetworkIcon()}
							<span>{selectedNetwork === "BSC" ? "BNB Chain" : selectedNetwork}</span>
							<Icon name="chevron-down-outline" />
						</button>

						{showNetworkMenu ? (
							<div className="network-menu">
								<ul className="network-menu__list">
									<li
										className={
											selectedNetwork === Networks.Sepolia
												? "network-menu__item network-menu__item--selected"
												: "network-menu__item"
										}
										onClick={() => onNetworkChanged(Networks.Sepolia)}
									>
										<i className="network-menu__icon fa-brands fa-ethereum"></i>
										<span>Ethereum</span>
										<small>(Sepolia)</small>
									</li>
									<li
										className={
											selectedNetwork === Networks.BSC
												? "network-menu__item network-menu__item--selected"
												: "network-menu__item"
										}
										onClick={() => onNetworkChanged(Networks.BSC)}
									>
										<img src={BNBChainLogo} alt="BNB-chain" />
										<span>BNB Chain</span>
										<small>(testnet)</small>
									</li>
									<li
										className={
											selectedNetwork === Networks.Avalanche
												? "network-menu__item network-menu__item--selected"
												: "network-menu__item"
										}
										onClick={() => onNetworkChanged(Networks.Avalanche)}
									>
										<img src={AvalancheLogo} alt="Avalanche" />
										<span>Avalanche</span>
										<small>(Fuji)</small>
									</li>
									<li
										className={
											selectedNetwork === Networks.Polygon
												? "network-menu__item network-menu__item--selected"
												: "network-menu__item"
										}
										onClick={() => onNetworkChanged(Networks.Polygon)}
									>
										<img src={PolygonLogo} alt="Polygon" /> <span>{Networks.Polygon}</span>
										<small>(Mumbai)</small>
									</li>
								</ul>
							</div>
						) : null}
					</div>
				</div>

				<div className="Header__account">
					<button
						onClick={connectWallet}
						className={`Header__account-btn ${account ? "connected" : ""}`}
						title={account ? account : "Please connect your wallet!"}
					>
						{account ? <Icon name="person" /> : <Icon name="wallet" />}
						<p className="Header__account-address">{account ? accountAddress : "Connect Wallet"}</p>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
