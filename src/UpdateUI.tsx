import React, { useState } from 'react'
import { Map } from './Map'
import { Slider } from './Slider'
import type { Update } from './updateReported'
import styled from 'styled-components'
import { AccelerometerSlider } from './AccelerometerSlider'
import { Device } from './Device'
import { PGPS } from './PGPS'
import { AGPS } from './AGPS'
import * as MccMncList from 'mcc-mnc-list'
import { NCellMeas } from './NCellMeas'

const DeviceInfoList = styled.dl`
	dd + dt {
		margin-top: 1rem;
	}
	dd input[type='range'] {
		width: 100%;
	}
`

export const UpdateUI = ({
	endpoint,
	updateReported: u,
	sendSensorMessage: s,
	sendMessage: m,
}: {
	endpoint: URL
	updateReported: (u: Update) => void
	sendSensorMessage: (m: Update) => void
	sendMessage: (m: Record<string, any>, t: string) => void
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
	const [nw, setNw] = useState('LAN')
	const [mcc, setMcc] = useState<string>('242')
	const [mnc, setMnc] = useState<string>('2')
	const [cell, setCell] = useState<number>(33703719)
	const [area, setArea] = useState<number>(12)

	return (
		<Device endpoint={endpoint}>
			{({ deviceId, config }) => (
				<>
					<form>
						<DeviceInfoList>
							<dt>DeviceId</dt>
							<dd>{deviceId}</dd>
							<dt>Config</dt>
							<dd>{JSON.stringify(config)}</dd>
							<dt>Network</dt>
							<dd>
								<select
									onChange={({ target: { value } }) => {
										setNw(value)
										u({
											property: 'dev',
											v: {
												nw: value,
											},
										})
									}}
									value={nw}
								>
									<option>LAN</option>
									<option>WiFi</option>
									<option>LTE-M GPS</option>
									<option>LTE-M</option>
									<option>NB-IoT GPS</option>
									<option>NB-IoT</option>
								</select>
							</dd>
							<dt>
								<label htmlFor="mcc">Mobile Country Code:</label>
							</dt>
							<dd>
								<select
									id="mcc"
									value={mcc}
									onChange={({ target: { value } }) => {
										setMcc(value)
										u({
											property: 'roam',
											v: {
												mccmnc: `${value}${mnc}`,
											},
										})
									}}
								>
									{Object.entries(
										MccMncList.all()
											.filter(({ status }) => status === 'Operational')
											.sort(({ countryName: c1 }, { countryName: c2 }) =>
												(c1 ?? 'Z').localeCompare(c2 ?? 'Z'),
											)
											.reduce(
												(mccs, { mcc, countryName }) => ({
													...mccs,
													[mcc]: countryName,
												}),
												{} as Record<string, string>,
											),
									).map(([mcc, countryName]) => (
										<option key={mcc} value={mcc}>
											{countryName ?? mcc} ({mcc})
										</option>
									))}
								</select>
							</dd>
							<dt>
								<label htmlFor="mnc">Mobile Network Code:</label>
							</dt>
							<dd>
								{mcc === undefined && (
									<select id="mnc" disabled>
										<option>Please select a MCC</option>
									</select>
								)}
								{mcc !== undefined && (
									<select
										id="mnc"
										value={mnc}
										onChange={({ target: { value } }) => {
											setMnc(value)
											u({
												property: 'roam',
												v: {
													mccmnc: `${mcc}${value}`,
												},
											})
										}}
									>
										{MccMncList.all()
											.filter(({ mcc: m }) => m === mcc)
											.sort(({ mnc: m1 }, { mnc: m2 }) => m1.localeCompare(m2))
											.map(({ mnc, brand, operator }) => (
												<option key={mnc} value={mnc}>
													{brand} {operator} ({mnc})
												</option>
											))}
									</select>
								)}
							</dd>
							<dt>
								<label htmlFor="cell">Cell:</label>
							</dt>
							<dd>
								<input
									id="cell"
									type="number"
									step={1}
									min={0}
									value={cell}
									onChange={({ target: { value } }) => {
										setCell(parseInt(value, 10))
										u({
											property: 'roam',
											v: {
												cell: value,
											},
										})
									}}
								/>
							</dd>
							<dt>
								<label htmlFor="area">Area:</label>
							</dt>
							<dd>
								<input
									id="area"
									type="number"
									step={1}
									min={0}
									value={area}
									onChange={({ target: { value } }) => {
										setArea(parseInt(value, 10))
										u({
											property: 'roam',
											v: {
												area: value,
											},
										})
									}}
								/>
							</dd>
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
											s({
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
					<PGPS sendMessage={m} />
					<AGPS
						sendMessage={m}
						mnc={parseInt(mnc ?? '2', 10)}
						mcc={parseInt(mcc ?? '242', 10)}
						cell={cell ?? 33703719}
						area={area ?? 12}
					/>
					<NCellMeas sendMessage={m} />
				</>
			)}
		</Device>
	)
}
