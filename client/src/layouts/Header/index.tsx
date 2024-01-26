import { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../../assets/images/spectre-logo-light.png";

import { Icon } from "../../components";
import "./Header.scss";

const Header = ({ connectWallet, account }) => {
	const accountAddress = `${account?.substring(0, 7) || "0x000"}...${account?.substring(38, 42) || "0000"}`;

	return (
		<header className="Header">
			<div className="Header__logo">
				<Link to="/" className="Header__link">
					<img src={Logo} alt="Spectre-DEX-logo" className="Header__img" />
					<h1 className="Header__title">Spectre</h1>
					<span className="Header__span">faucet</span>
				</Link>
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
		</header>
	);
};

export default Header;
