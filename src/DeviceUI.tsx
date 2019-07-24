import React, { useState, useEffect } from 'react'
import {
	Alert,
	Navbar,
	NavbarBrand,
} from 'reactstrap'
import logo from './logo.svg'
import './DeviceUI.scss'

const Slider = ({ label, min, max, endpoint }: {
	label: string
	min: number
	max: number
	endpoint: string
}) => {
	const [v, changeV] = useState((max - min) / 2)
	const [error, setError] = useState()
	const [sliderState, setSliderState] = useState(50)
	return <div className="form-group">
		<label htmlFor={`${label}Slider`}>{label}: {v}</label>
		<input
			type="range"
			className="form-control-range"
			id={`${label}Slider`}
			min="0"
			max="100"
			value={sliderState}
			onChange={({ target: { value } }) => {
				const s = parseInt(value, 10)
				setSliderState(s)
				changeV(((s / 100) * (max - min)) + min)
			}}
			onMouseUp={() => {
				fetch(`${endpoint}/update`, {
					method: 'POST',
					body: JSON.stringify({
						[label]: {
							v: v,
							ts: new Date().toISOString(),
						},
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then(response => {
						if (!response.ok) {
							setError(`${response.status}: ${response.statusText}`)
						}
						setError(undefined)
					})
					.catch(err => {
						setError(err.message)
					})
			}}
		/>
		{error && <Alert color="danger">
			{JSON.stringify(error)}
		</Alert>}
	</div>
}

const Device = ({ endpoint, children }: {
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

export const DeviceUIApp = ({ endpoint }: { endpoint: string }) => <>
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
		<Device endpoint={endpoint}>{({ deviceId }) => <form>
			<dl>
				<dt>DeviceId</dt>
				<dd>{deviceId}</dd>
			</dl>
			<Slider label='batteryVoltage' min={0} max={3.3} endpoint={endpoint}/>
		</form>}
		</Device>
	</main>
</>
