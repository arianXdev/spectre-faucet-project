import { Link } from "react-router-dom";

import Logo from "../../assets/images/spectre-logo-light.png";

import "./Header.scss";

const Header = () => {
	return (
		<header className="Header">
			<div className="Header__logo">
				<Link to="/" className="Header__link">
					<img src={Logo} alt="Spectre-DEX-logo" className="Header__img" />
					<h1 className="Header__title">Spectre</h1>
					<span className="Header__span">faucet</span>
				</Link>
			</div>
		</header>
	);
};

export default Header;
