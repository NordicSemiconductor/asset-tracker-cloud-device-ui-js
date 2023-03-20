import * as MccMncList from 'mcc-mnc-list'
import React, { useState } from 'react'
import { AGPS } from './AGPS'
import { Device } from './Device'
import { GNSS } from './GNSS'
import { NetworkSurvey } from './NetworkSurvey'
import { PGPS } from './PGPS'
import { Slider } from './Slider'
import type { SensorMessage, Update } from './updateReported'

export const UpdateUI = ({
	updateReported: u,
	sensorMessage: s,
}: {
	updateReported: (u: Update) => void
	sensorMessage: (m: SensorMessage) => void
}) => {
	const [batteryVoltage, setBatteryVoltage] = useState(0)
	const [temp, setTemp] = useState(21)
	const [hum, setHum] = useState(50)
	const [atmp, setAtmp] = useState(1030)
	const [rsrp, setRSRP] = useState(70)
	const [nw, setNw] = useState('LTE-M')
	const [mcc, setMcc] = useState<string>('242')
	const [mnc, setMnc] = useState<string>('02')
	const [band, setBand] = useState<number>(3)
	const [cell, setCell] = useState<number>(33703719)
	const [area, setArea] = useState<number>(12)
	const [magnitude, setMagnitude] = useState<number>(1)

	return (
		<Device>
			{({ deviceId, config }) => (
				<>
					<div className="row justify-content-center">
						<div className="col-12 col-md-8 col-lg-6 col-xl-5">
							<div className="card">
								<div className="card-header">
									Device ID: <code>{deviceId}</code>
								</div>
								<div className="card-body pb-0">
									<dt>Config</dt>
									<dl className="row">
										{config !== undefined &&
											Object.entries(config).map(([k, v]) => (
												<React.Fragment key={k}>
													<dt className="col-sm-2">{k}</dt>
													<dd className="col-sm-10 mb-0">
														<code>{JSON.stringify(v)}</code>
													</dd>
												</React.Fragment>
											))}
									</dl>
								</div>
							</div>
							<form className="card mt-4">
								<div className="card-header">Battery information</div>
								<div className="card-body">
									<label htmlFor="voltage">
										Battery voltage: {batteryVoltage}
									</label>
									<Slider
										id="voltage"
										min={0}
										max={3300}
										value={batteryVoltage}
										onChange={(v) => {
											setBatteryVoltage(Math.round(v))
											u({
												bat: { v, ts: Date.now() },
											})
										}}
									/>
								</div>
							</form>
							<form className="card mt-4">
								<div className="card-header">Environment information</div>
								<div className="card-body">
									<div className="mb-3">
										<label htmlFor="temperature">Temperature: {temp}°C</label>
										<Slider
											id="temperature"
											min={-20}
											max={80}
											value={temp}
											onChange={(v) => {
												setTemp(Math.round(v))
											}}
										/>
									</div>
									<div className="mb-3">
										<label htmlFor="humidity">Humidity: {hum}%</label>
										<Slider
											id="humidity"
											min={0}
											max={100}
											value={hum}
											onChange={(v) => {
												setHum(Math.round(v))
											}}
										/>
									</div>
									<div>
										<label htmlFor="barometric_pressure">
											Barometric Pressure: {atmp} hPa
										</label>
										<Slider
											id="barometric_pressure"
											min={850}
											max={1100}
											value={atmp}
											onChange={(v) => {
												setAtmp(v)
											}}
										/>
									</div>
								</div>
								<div className="card-footer d-flex flex-row-reverse">
									<button
										type="button"
										className="btn btn-primary"
										onClick={() => {
											u({
												env: {
													v: {
														hum,
														temp,
														atmp: atmp / 10, // device reports in kPa
													},
													ts: Date.now(),
												},
											})
										}}
									>
										Send
									</button>
								</div>
							</form>
						</div>
						<div className="col-12 col-md-8 col-lg-6 col-xl-5">
							<form className="card">
								<div className="card-header">Roaming information</div>
								<div className="card-body">
									<div className="mb-3">
										<label htmlFor="nw">Network</label>
										<select
											className="form-select"
											aria-label="Select a network"
											onChange={({ target: { value } }) => {
												setNw(value)
											}}
											value={nw}
											id="nw"
										>
											<option>LAN</option>
											<option>WiFi</option>
											<option>LTE-M</option>
											<option>NB-IoT</option>
										</select>
									</div>
									<div className="mb-3">
										<label htmlFor="mcc">Mobile Country Code (MCC):</label>
										<select
											className="form-select"
											aria-label="Select a Mobile Country Code (MCC)"
											id="mcc"
											value={mcc}
											onChange={({ target: { value } }) => {
												setMcc(value)
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
									</div>
									<div className="mb-3">
										<label htmlFor="mnc">Mobile Network Code (MNC):</label>
										{mcc === undefined && (
											<select
												className="form-select"
												aria-label="Select a Mobile Network Code (MNC)"
												id="mnc"
												disabled
											>
												<option>Please select a MCC</option>
											</select>
										)}
										{mcc !== undefined && (
											<select
												className="form-select"
												aria-label="Select a Mobile Network Code (MNC)"
												id="mnc"
												value={mnc}
												onChange={({ target: { value } }) => {
													setMnc(value)
												}}
											>
												{MccMncList.all()
													.filter(({ mcc: m }) => m === mcc)
													.sort(({ mnc: m1 }, { mnc: m2 }) =>
														m1.localeCompare(m2),
													)
													.map(({ mnc, brand, operator }) => (
														<option key={mnc} value={mnc}>
															{brand} {operator} ({mnc})
														</option>
													))}
											</select>
										)}
									</div>
									<div className="mb-3">
										<label htmlFor="band">Band:</label>
										<input
											type="text"
											className="form-control"
											id="band"
											step={1}
											min={0}
											value={band}
											onChange={({ target: { value } }) => {
												setBand(parseInt(value, 10))
											}}
										/>
									</div>
									<div className="mb-3">
										<label htmlFor="cell">Cell:</label>
										<input
											type="text"
											className="form-control"
											id="cell"
											step={1}
											min={0}
											value={cell}
											onChange={({ target: { value } }) => {
												setCell(parseInt(value, 10))
											}}
										/>
									</div>
									<div className="mb-3">
										<label htmlFor="area">Area:</label>
										<input
											type="text"
											className="form-control"
											id="area"
											step={1}
											min={0}
											value={area}
											onChange={({ target: { value } }) => {
												setArea(parseInt(value, 10))
											}}
										/>
									</div>
									<div>
										<label htmlFor="rsrp">RSRP: -{rsrp}</label>
										<Slider
											id="rsrp"
											min={-110}
											max={-70}
											value={-rsrp}
											onChange={(v) => {
												setRSRP(Math.round(-v))
											}}
										/>
									</div>
								</div>
								<div className="card-footer d-flex flex-row-reverse">
									<button
										type="button"
										className="btn btn-primary"
										onClick={() => {
											u({
												roam: {
													v: {
														nw,
														band,
														mccmnc: parseInt(
															`${mcc}${mnc.padStart(2, '0')}`,
															10,
														),
														cell,
														area,
														rsrp: -rsrp,
														ip: '0.0.0.0',
													},
													ts: Date.now(),
												},
											})
										}}
									>
										Send
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-12 col-md-8 col-lg-6 col-xl-5">
							<form className="card mt-4">
								<div className="card-header">Buttons</div>
								<div className="card-body d-flex flex-row justify-content-between">
									{[...Array(4)].map((_, k) => (
										<button
											key={k}
											className="btn btn-outline-secondary"
											type="button"
											onClick={() => {
												s({
													btn: {
														v: k + 1,
														ts: Date.now(),
													},
												})
											}}
										>
											Button {k + 1}
										</button>
									))}
								</div>
							</form>
						</div>
						<div className="col-12 col-md-8 col-lg-6 col-xl-5">
							<form className="card mt-4">
								<div className="card-header">Impact</div>
								<div className="card-body">
									<div>
										<label htmlFor="magnitude">Magnitude: {magnitude} G</label>
										<Slider
											id="magnitude"
											min={0}
											max={300}
											value={magnitude}
											onChange={(v) => {
												setMagnitude(Math.round(v))
											}}
										/>
									</div>
								</div>
								<div className="card-footer d-flex flex-row-reverse">
									<button
										type="button"
										className="btn btn-primary"
										onClick={() => {
											s({
												impact: {
													v: magnitude,
													ts: Date.now(),
												},
											})
										}}
									>
										Send
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-12 col-md-8 col-lg-6 col-xl-5">
							<GNSS onUpdate={(gnss) => u({ gnss })} />
						</div>
						<div className="col-12 col-md-8 col-lg-6 col-xl-5">
							<PGPS />
							<AGPS
								mnc={parseInt(mnc ?? '2', 10)}
								mcc={parseInt(mcc ?? '242', 10)}
								cell={cell ?? 33703719}
								area={area ?? 12}
							/>
							<NetworkSurvey />
						</div>
					</div>
				</>
			)}
		</Device>
	)
}
