import React, { useState, useEffect } from 'react'
import { Alert, Navbar, NavbarBrand } from 'reactstrap'
import logo from './logo.svg'
import './DeviceUI.scss'
import { Map } from './Map'
import { Slider } from './Slider'
import { updateReported } from './updateReported'

import './DeviceUI.scss'

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
	const [batteryVoltage, setBatteryVoltage] = useState(0)
	const [acc, setAcc] = useState({ x: 0, y: 0, z: 0 })
	const [gps, setGps] = useState({ lat: 0, lng: 0 })
	const [accError, setAccError] = useState()

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
								<dt>
									Battery voltage: {batteryVoltage}
								</dt>
								<dd>
									<Slider
										id="voltage"
										min={0}
										max={3300}
										formatValue={Math.round}
										onChange={v => {
											setBatteryVoltage(v)
											u({
												property: 'bat',
												v,
											}).catch(setBatterError)
										}}
									/>
									{batteryError && (
										<Alert color="danger">{JSON.stringify(batteryError)}</Alert>
									)}
								</dd>
								<dt>Location</dt>
								<dd>
									<Map
										onPositionChange={({ lat, lng }) => {
											if (gps.lng !== lng || gps.lng !== lng) {
												setGps({ lat, lng })
												u({
													property: 'gps',
													v: {
														lat,
														lng,
													},
												}).catch(setGpsError)
											}
										}}
									/>
									{gpsError && (
										<Alert color="danger">{JSON.stringify(gpsError)}</Alert>
									)}
								</dd>
								<dt>Accelerometer: {JSON.stringify([
									acc.x,
									acc.y,
									acc.z
								])}</dt>
								<dd>
									<AccelerometerSlider
										value={acc}
										onChange={({ x, y, z }) => {
											if (acc.x !== x || acc.y !== y || acc.z !== z) {
												setAcc({ x, y, z })
												u({
													property: 'acc',
													v: [x, y, z],
												}).catch(setAccError)
											}
										}}
									/>
									{accError && (
										<Alert color="danger">{JSON.stringify(accError)}</Alert>
									)}
								</dd>
							</dl>
						</form>
					)}
				</Device>
			</main>
		</>
	)
}

const AccelerometerSlider = ({
	onChange,
	value,
}: {
	onChange: (args: { x: number; y: number; z: number }) => void
	value: { x: number; y: number; z: number }
}) => <>
	<Slider
		id="acc-x"
		min={0}
		max={10}
		value={value.x}
		onChange={x => {
			onChange({
				...value,
				x,
			})
		}}
	/>
	<Slider
		id="acc-y"
		min={0}
		max={10}
		value={value.y}
		onChange={y => {
			onChange({
				...value,
				y,
			})
		}}
	/>
	<Slider
		id="acc-z"
		min={0}
		max={10}
		value={value.z}
		onChange={z => {
			onChange({
				...value,
				z,
			})
		}}
	/>
</>