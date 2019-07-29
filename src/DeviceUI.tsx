import React, { useState, useEffect } from 'react'
import { Alert, Navbar, NavbarBrand } from 'reactstrap'
import logo from './logo.svg'
import './DeviceUI.scss'
import { Map } from './Map'
import { Slider } from './Slider'
import { updateReported } from './updateReported'

const Device = ({
	endpoint,
	children,
}: {
	endpoint: string
	children: (args: { deviceId: string }) => JSX.Element | null
}): JSX.Element | null => {
	const [deviceId, setDeviceId] = useState('')
	useEffect(() => {
		fetch(`${endpoint}/id`)
			.then(async response => {
				setDeviceId(await response.text())
			})
			.catch(err => console.error(err))
	}, [endpoint])
	if (!deviceId) {
		return <p>Connecting to {endpoint} ...</p>
	}
	return children({ deviceId })
}

export const DeviceUIApp = ({ endpoint }: { endpoint: string }) => {
	const [batteryError, setBatterError] = useState()
	const [gpsError, setGpsError] = useState()

	const u = updateReported({ endpoint })

	return (
		<>
			<header className="bg-light">
				<Navbar color="light" light>
					<NavbarBrand href="/">
						<img
							src={logo}
							width="30"
							height="30"
							className="d-inline-block align-top"
							alt="Cat Tracker"
						/>
						Cat Tracker Simulator
					</NavbarBrand>
				</Navbar>
			</header>
			<main>
				<Device endpoint={endpoint}>
					{({ deviceId }) => (
						<form>
							<dl>
								<dt>DeviceId</dt>
								<dd>{deviceId}</dd>
							</dl>
							<Slider
								label="Battery voltage"
								min={0}
								max={3300}
								formatValue={Math.round}
								onChange={v => {
									u({
										property: 'bat',
										v,
									}).catch(setBatterError)
								}}
							/>
							{batteryError && (
								<Alert color="danger">{JSON.stringify(batteryError)}</Alert>
							)}
							<Map
								onPositionChange={({ lat, lng }) => {
									u({
										property: 'gps',
										v: {
											lat, lng
										}
									}).catch(setGpsError)
								}}
							/>
							{gpsError && (
								<Alert color="danger">{JSON.stringify(gpsError)}</Alert>
							)}
						</form>
					)}
				</Device>
			</main>
		</>
	)
}
