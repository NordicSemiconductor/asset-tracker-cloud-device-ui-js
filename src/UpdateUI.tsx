import React, { useState } from 'react'
import { Map } from './Map'
import { Slider } from './Slider'
import type { Update } from './updateReported'
import styled from 'styled-components'
import { AccelerometerSlider } from './AccelerometerSlider'
import { Device } from './Device'

const DeviceInfoList = styled.dl`
	dd + dt {
		margin-top: 1rem;
	}
`

export const UpdateUI = ({
	endpoint,
	updateReported: u,
	sendMessage: m,
}: {
	endpoint: URL
	updateReported: (u: Update) => void
	sendMessage: (m: Update) => void
}) => {
	const [batteryVoltage, setBatteryVoltage] = useState(0)
	const [accuracy, setAccuracy] = useState(0)
	const [acc, setAcc] = useState({ x: 0, y: 0, z: 0 })
	const [hdg, setHdg] = useState(0)
	const [spd, setSpd] = useState(0)
	const [alt, setAlt] = useState(0)
	const [gps, setGps] = useState({ lat: 0, lng: 0 })
	const [temp, setTemp] = useState(21)
	const [hum, setHum] = useState(50)
	const [rsrp, setRSRP] = useState(70)

	return (
		<Device endpoint={endpoint}>
			{({ deviceId, config }) => (
				<form>
					<DeviceInfoList>
						<dt>DeviceId</dt>
						<dd>{deviceId}</dd>
						<dt>Config</dt>
						<dd>{JSON.stringify(config)}</dd>
						<dt>RSRP: -{rsrp}</dt>
						<dd>
							<Slider
								id="rsrp"
								min={-110}
								max={-70}
								value={-rsrp}
								formatValue={Math.round}
								onChange={(v) => {
									setRSRP(-v)
									u({
										property: 'roam',
										v: {
											rsrp: -v,
										},
									})
								}}
							/>
						</dd>
						<dt>Battery voltage: {batteryVoltage}</dt>
						<dd>
							<Slider
								id="voltage"
								min={0}
								max={3300}
								formatValue={Math.round}
								value={batteryVoltage}
								onChange={(v) => {
									setBatteryVoltage(v)
									u({
										property: 'bat',
										v,
									})
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
												acc: accuracy,
												hdg,
												spd,
												alt,
											},
										})
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
											v: { x, y, z },
										})
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
										})
									}}
								>
									Button {k + 1}
								</button>
							))}
						</dd>
						<dt>Temperature: {temp}°C</dt>
						<dd>
							<Slider
								id="temperature"
								min={-20}
								max={80}
								value={temp}
								formatValue={Math.round}
								onChange={(v) => {
									setTemp(v)
									u({
										property: 'env',
										v: {
											temp: v,
										},
									})
								}}
							/>
						</dd>
						<dt>Humidity: {hum}%</dt>
						<dd>
							<Slider
								id="humidity"
								min={0}
								max={100}
								value={hum}
								formatValue={Math.round}
								onChange={(v) => {
									setHum(v)
									u({
										property: 'env',
										v: {
											hum: v,
										},
									})
								}}
							/>
						</dd>
					</DeviceInfoList>
				</form>
			)}
		</Device>
	)
}
