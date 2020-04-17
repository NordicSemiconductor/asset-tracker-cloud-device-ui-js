import React, { useEffect, useState } from 'react'
import { Alert, Navbar, NavbarBrand } from 'reactstrap'
import logo from './logo.svg'
import { Map } from './Map'
import { Slider } from './Slider'
import { updateReported } from './updateReported'
import { sendMessage } from './sendMessage'
import styled from 'styled-components'
import { GlobalStyle, Main, mobileBreakpoint } from './Styles'

const LogoImg = styled.img`
	margin-right: 0.25rem;
`

const DeviceInfoList = styled.dl`
	dd + dt {
		margin-top: 1rem;
	}
`

const StyledNavbar = styled(Navbar)`
	@media (min-width: ${mobileBreakpoint}) {
		max-width: ${mobileBreakpoint};
		margin: 0 auto;
	}
`

const Device = ({
	endpoint,
	children,
}: {
	endpoint: string
	children: (args: { deviceId: string; config: any }) => JSX.Element | null
}): JSX.Element | null => {
	const [deviceId, setDeviceId] = useState('')
	const [config, setConfig] = useState()
	useEffect(() => {
		fetch(`${endpoint}/id`)
			.then(async (response) => {
				setDeviceId(await response.text())
			})
			.catch((err) => console.error(err))

		const connection = new WebSocket(endpoint.replace(/^https?/, 'ws'))
		connection.onopen = () => {
			console.debug('[ws]', 'open')
		}
		connection.onerror = (error) => {
			console.error('[ws]', error)
		}
		connection.onmessage = (message) => {
			console.debug('[ws]', 'message', message)
			setConfig(JSON.parse(message.data))
		}
	}, [endpoint])
	if (!deviceId) {
		return <p>Connecting to {endpoint} ...</p>
	}
	return children({ deviceId, config })
}

export const DeviceUIApp = ({ endpoint }: { endpoint: string }) => {
	const [error, setError] = useState()
	const [batteryVoltage, setBatteryVoltage] = useState(0)
	const [accuracy, setAccuracy] = useState(0)
	const [acc, setAcc] = useState({ x: 0, y: 0, z: 0 })
	const [hdg, setHdg] = useState(0)
	const [spd, setSpd] = useState(0)
	const [alt, setAlt] = useState(0)
	const [gps, setGps] = useState({ lat: 0, lng: 0 })

	const u = updateReported({ endpoint })
	const m = sendMessage({ endpoint })

	return (
		<>
			<GlobalStyle />
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
				</StyledNavbar>
			</header>
			<Main>
				<Device endpoint={endpoint}>
					{({ deviceId, config }) => (
						<form>
							{error && <Alert color="danger">{JSON.stringify(error)}</Alert>}
							<DeviceInfoList>
								<dt>DeviceId</dt>
								<dd>{deviceId}</dd>
								<dt>Config</dt>
								<dd>{JSON.stringify(config)}</dd>
								<dt>Battery voltage: {batteryVoltage}</dt>
								<dd>
									<Slider
										id="voltage"
										min={0}
										max={3300}
										formatValue={Math.round}
										onChange={(v) => {
											setBatteryVoltage(v)
											u({
												property: 'bat',
												v,
											}).catch(setError)
										}}
									/>
								</dd>
								<dt>GPS: Position</dt>
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
												}).catch(setError)
											}
										}}
									/>
								</dd>
								<dt>GPS Accuracy: {accuracy}</dt>
								<dd>
									<Slider
										id="accuracy"
										min={0}
										max={200}
										onChange={(v) => {
											setAccuracy(v)
											u({
												property: 'gps',
												v: { acc: v },
											}).catch(setError)
										}}
									/>
								</dd>
								<dt>GPS Heading: {hdg}</dt>
								<dd>
									<Slider
										id="heading"
										min={0}
										max={360}
										onChange={(v) => {
											setHdg(v)
											u({
												property: 'gps',
												v: { hdg: v },
											}).catch(setError)
										}}
									/>
								</dd>
								<dt>GPS Speed: {spd}</dt>
								<dd>
									<Slider
										id="speed"
										min={0}
										max={100}
										onChange={(v) => {
											setSpd(v)
											u({
												property: 'gps',
												v: { spd: v },
											}).catch(setError)
										}}
									/>
								</dd>
								<dt>GPS Altitude: {alt}</dt>
								<dd>
									<Slider
										id="altitude"
										min={0}
										max={3000}
										onChange={(v) => {
											setAlt(v)
											u({
												property: 'gps',
												v: { alt: v },
											}).catch(setError)
										}}
									/>
								</dd>
								<dt>Accelerometer: {JSON.stringify([acc.x, acc.y, acc.z])}</dt>
								<dd>
									<AccelerometerSlider
										value={acc}
										onChange={({ x, y, z }) => {
											if (acc.x !== x || acc.y !== y || acc.z !== z) {
												setAcc({ x, y, z })
												u({
													property: 'acc',
													v: [x, y, z],
												}).catch(setError)
											}
										}}
									/>
								</dd>
								<dt>Buttons</dt>
								<dd>
									{[...Array(4)].map((_, k) => (
										<button
											key={k}
											type="button"
											onClick={() => {
												m({
													property: 'btn',
													v: k + 1,
												}).catch(setError)
											}}
										>
											Button {k + 1}
										</button>
									))}
								</dd>
							</DeviceInfoList>
						</form>
					)}
				</Device>
			</Main>
		</>
	)
}

const AccelerometerSlider = ({
	onChange,
	value,
}: {
	onChange: (args: { x: number; y: number; z: number }) => void
	value: { x: number; y: number; z: number }
}) => (
	<>
		<Slider
			id="acc-x"
			min={0}
			max={10}
			value={value.x}
			onChange={(x) => {
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
			onChange={(y) => {
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
			onChange={(z) => {
				onChange({
					...value,
					z,
				})
			}}
		/>
	</>
)
