import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";

import { Header } from "./layouts";
import faucetContract from "./ethereum/faucet";

import { Toaster } from "react-hot-toast";
import Typed from "typed.js";

import "./App.scss";

const App = () => {
	const arianNameRef = useRef<HTMLHeadingElement>(null);

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

	return (
		<>
			<div className="container">
				<Header />
			</div>

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
