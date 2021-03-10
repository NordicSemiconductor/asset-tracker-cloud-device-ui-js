import React from 'react'
import { Navbar, NavbarBrand } from 'reactstrap'
import logo from './logo.svg'
import styled from 'styled-components'
import { mobileBreakpoint } from './Styles'

const LogoImg = styled.img`
	margin-right: 0.25rem;
`

const StyledNavbar = styled(Navbar)`
	@media (min-width: ${mobileBreakpoint}) {
		max-width: ${mobileBreakpoint};
		margin: 0 auto;
	}
`

export const Header = ({ children }: { children?: React.ReactNode }) => (
	<header className="bg-light">
		<StyledNavbar color="light" light>
			<NavbarBrand href="/">
				<LogoImg
					src={logo}
					width="30"
					height="30"
					className="d-inline-block align-top"
					alt="Cat Tracker"
				/>
				Cat Tracker Simulator
			</NavbarBrand>
			{children}
		</StyledNavbar>
	</header>
)
