import React from 'react'
import logo from '/logo.svg'

export const Header = ({ children }: { children?: React.ReactNode }) => (
	<header className="bg-light">
		<nav className="navbar navbar-light">
			<div className="container">
				<a className="navbar-brand" href="/">
					<img
						src={logo}
						width="30"
						height="30"
						className="d-inline-block align-top me-1"
						alt="nRF Asset Tracker"
					/>
					<span>nRF Asset Tracker Device Simulator UI</span>
				</a>
				{children}
			</div>
		</nav>
	</header>
)
